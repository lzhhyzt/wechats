/*
 * @Description: 微信公众平台接入
 * @Author: lizh 
 * @Date: 2018-11-21 14:44:37 
 * @Last Modified by: lizh
 * @Last Modified time: 2018-11-30 17:40:14
 */

const crypto = require('crypto')
const fs = require('fs')
const util = require('util')
const request = require('request')
const parseString = require('xml2js').parseString
const WeiXinMsg = require('./message.js')
const menu = require('../config/menu.json')
const accessTokenJson = require('../config/accessToken')
const Material = require('./material')
const Users = require('./users')
const sending = require('./sendMsg')
const config = require('../config/config.json')


//构建 WeChat 对象 即 js中 函数就是对象
var WeChat = function () {
  //设置 WeChat 对象属性 config
  this.config = config;
  //设置 WeChat 对象属性 token
  this.token = config.token;
  // 设置 WeChat 对象属性 appID
  this.appID = config.appID;
  //设置 WeChat 对象属性 appScrect
  this.appScrect = config.appScrect;
  //设置 WeChat 对象属性 apiDomain
  this.apiDomain = config.apiDomain;
  //设置 WeChat 对象属性 apiURL
  this.apiURL = config.apiURL;
}

/**
 * 微信接入认证
 * @param {*} req 请求对象
 */
WeChat.prototype.auth = function (req) {
  var that = this

  //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  var signature = req.query.signature //微信加密签名
  var timestamp = req.query.timestamp //时间戳
  var nonce = req.query.nonce //随机数
  var echostr = req.query.echostr //随机字符串

  //2.将token、timestamp、nonce三个参数进行字典序排序
  var array = [this.token, timestamp, nonce];
  array.sort();

  //3.将三个参数字符串拼接成一个字符串进行sha1加密
  var tempStr = array.join('');
  const hashCode = crypto.createHash('sha1'); //创建加密类型 
  var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

  //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (resultCode === signature) {
    res = echostr;
  } else {
    res = 'mismatch';
  }

  // 获取微信access_token
  that.getAccessToken().then(function (data) {
    // 创建菜单
    var url = util.format(that.apiURL.createMenu, that.apiDomain, data);
    request({
      method: "POST",
      url: url,
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: menu

    }, function (error, res, data) {
      if (!error && res.statusCode == 200) {
        console.log('菜单获取', data)
      } else {
        console.error(error)
      }
    })
  });

}


/**
 * 获取微信 access_token
 */
WeChat.prototype.getAccessToken = function () {
  var that = this;
  return new Promise(function (resolve, reject) {
    //获取当前时间 
    var currentTime = new Date().getTime();
    //格式化并组合请求地址
    var url = util.format(that.apiURL.accessTokenApi, that.apiDomain, that.appID, that.appScrect);

    //判断 本地存储的 access_token 是否为空，是否过期
    if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
      // 请求 access_token
      request(url, function (error, res, data) {
        var result = JSON.parse(data); // 解析返回数据

        if (!error && data.indexOf("errcode") < 0) { // 返回成功时

          accessTokenJson.access_token = result.access_token;
          accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;

          // 把 access_token 写入到存储文件中，如果已经有了就更新本地存储
          fs.writeFile('./config/accessToken.json', JSON.stringify(accessTokenJson), function (err) {
            if (err) {
              console.error(err)
            }
          });
          //将获取后的 access_token 返回
          resolve(accessTokenJson.access_token);
        } else {
          //将错误返回
          resolve(result);
        }
      });
    } else {
      //将本地存储的 access_token 返回
      resolve(accessTokenJson.access_token);
    }
  });
}


/**
 * 处理微信消息
 * @param {*} ctx 上下文
 */
WeChat.prototype.handleMsg = function (ctx) {
  let req = ctx.req;
  return new Promise(function (resolve, reject) {
    let buffer = [];
    // 监听 data 事件用于接收数据
    req.addListener('data', function (data) {
      buffer.push(data)
    })

    // 监听 end 事件用于处理接收完成的数据
    req.addListener('end', function () {
      var msgXml = Buffer.concat(buffer).toString('utf-8');
      // 解析xml
      parseString(msgXml, {
        explicitArray: false
      }, function (err, result) {
        if (!err) {
          result = result.xml;
          var toUser = result.ToUserName // 接收方
          var fromUser = result.FromUserName // 发送方

          // 判断消息类型：事件event或者是其他消息类型
          if (result.MsgType.toLowerCase() === "event") {
            // 判断事件类型
            switch (result.Event.toLowerCase()) {
              case 'subscribe': // 关注被动回复
                let txt = '欢迎关注便携生活助手！在这里，您能查天气，玩游戏，听笑话，还有更多更好玩的功能在不断更新中！请持续关注！'
                let msg1 = WeiXinMsg.txtMsg(fromUser, toUser, txt);
                resolve(msg1);
                break;
              case 'click': // 点击推送事件回复
                if (result.EventKey == "V001_Platform_Introduce") { // 平台介绍
                  let contentArr = [{
                    Title: "尚青春公众平台介绍",
                    Description: "这是一个以大学生时装穿着为主题的平台，主要是服装上的搭配，热门服装的介绍，以及推动更多青春期的热点话题",
                    PicUrl: "http://lzhhyzt123.com/shangqinchun.jpg",
                    Url: "http://blog.csdn.net/hvkcoder/article/details/72868520"
                  }];
                  let msg2 = WeiXinMsg.graphicMsg(fromUser, toUser, contentArr);
                  resolve(msg2)
                } else if (result.EventKey == "V001_Blogger") { // 我的博客
                  let contentArr = [{
                      Title: "欢迎来到我的博客",
                      Description: "这是我的个人博客，欢迎各位来踩点访问",
                      PicUrl: "http://lzhhyzt123.com/csdn_logo.jpg",
                      Url: "https://www.csdn.net/"
                    },
                    {
                      Title: "尚青春公众平台介绍",
                      Description: "这是一个以大学生时装穿着为主题的平台，主要是服装上的搭配，热门服装的介绍，以及推动更多青春期的热点话题",
                      PicUrl: "http://lzhhyzt123.com/shangqinchun.jpg",
                      Url: "https://movie.douban.com/subject/27120292/"
                    },
                    {
                      Title: "毒液-致命守护者",
                      Description: "《毒液：致命守护者》是一部由美国哥伦比亚电影公司、腾讯影业、漫威影业联合出品，索尼电影娱乐公司发行的科幻电影",
                      PicUrl: "https://img3.doubanio.com/view/photo/m/public/p2537158013.webp",
                      Url: "https://movie.douban.com/subject/3168101/"
                    }
                  ];
                  let msg3 = WeiXinMsg.graphicMsg(fromUser, toUser, contentArr);
                  resolve(msg3)
                }
                break;
              case 'SCAN':  // 扫描二维码事件（微信占不支持，获取不到信息）
                // 扫描二维码得到结果（字符串信息）
                console.log(result)
                resolve(WeiXinMsg.txtMsg(fromUser, toUser, result.Ticket));
                break;
            }
          } else {
            // 如果用户发送消息类型是文本类型：text
            if (result.MsgType.toLowerCase() === "text") {
              switch (result.Content) {
                case '笑话':
                  var jokes = [
                    "我问妈妈：“如果时间倒流，你还会选择嫁给爸爸吗?”妈妈说道：“还会的!”我很感动，虽然妈妈经常抱怨爸爸的小毛病，但还是深爱着爸爸的埃然后妈妈对我说：“你怎么不问问，如果时间倒流，我还会生你吗？”",
                    "我发圈：再也不想单身了，多么希望有个人可以和我一起吃饭的时候抢菜吃，白天抢电脑，晚上抢被子！损友回：早上抢刮胡刀。。。",
                    "我以为若干年后，我们再次见面,你我都开着车，在一个豪华的大酒店聚会。然而现实却是：我在工地搬砖，你却和你老公来工地挑户型！我次奥！",
                    "成语新释“远交近攻”：孩子做作业的时侯，离的远一点还能交流交流，离的近了，想不攻击都难！",
                    "和几个朋友一块去吃饭，有个朋友尿急，我们边找厕所边找饭店，忽然那货大踏步走进一家饭店，指着厕所说：这有厕所，在这吃！"
                  ]
                  resolve(WeiXinMsg.txtMsg(fromUser, toUser, joke[Math.floor(Math.random() * 5)])); // 随机取一条笑话
                  break;
                case '编程':
                  resolve(WeiXinMsg.txtMsg(fromUser, toUser, 'Node.js是一个开放源代码、跨平台的JavaScript语言运行环境，采用Google开发的V8运行代码,使用事件驱动、非阻塞和异步输入输出模型等技术来提高性能，可优化应用程序的传输量和规模。这些技术通常用于数据密集的事实应用程序'));
                  break;
                case '文章':
                  var contentArr = [{
                      Title: "Node.js 微信自定义菜单",
                      Description: "使用Node.js实现自定义微信菜单",
                      PicUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542789491972&di=db93cc3521aa3cdc09340b4a14c135b9&imgtype=0&src=http%3A%2F%2Foss.aliyuncs.com%2Fphotogallery%2Fphoto%2F1257842289342004%2F14714%2Fe18d497b-8e4b-43ca-9d6e-f4e02a47c6ba.jpg",
                      Url: "http://blog.csdn.net/hvkcoder/article/details/72868520"
                    },
                    {
                      Title: "Node.js access_token的获取、存储及更新",
                      Description: "Node.js access_token的获取、存储及更新",
                      PicUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542789524916&di=732a0cb6eb64853cfcc4dadabfc1e0e9&imgtype=0&src=http%3A%2F%2Fp9.qhimg.com%2Ft01b43ba015415b81ce.png",
                      Url: "http://blog.csdn.net/hvkcoder/article/details/72783631"
                    },
                    {
                      Title: "Node.js 接入微信公众平台开发",
                      Description: "Node.js 接入微信公众平台开发",
                      PicUrl: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1478090851,2504069345&fm=26&gp=0.jpg",
                      Url: "http://blog.csdn.net/hvkcoder/article/details/72765279"
                    }
                  ];
                  //回复图文消息，微信默认随机取一条
                  resolve(WeiXinMsg.graphicMsg(fromUser, toUser, contentArr));
                  break;
                case "图片":
                  let mediaId = "zIB4PE1cPwPexJGNhxGckVPvxNXt6_pHLcjOtq1DHWw";
                  resolve(WeiXinMsg.imgMsg(fromUser, toUser, mediaId));
                  break;
                case "音乐":
                  let mContent = {
                    title: '爱的魔法',
                    description: '金莎',
                    musicUrl: 'http://lzhhyzt123.com/%E7%88%B1%E7%9A%84%E9%AD%94%E6%B3%95.mp3',
                    HQMusicUrl: 'http://lzhhyzt123.com/%E7%88%B1%E7%9A%84%E9%AD%94%E6%B3%95.mp3',
                    mediaId: 'mYTdBbdc3-nJmdeo9jljWoWAiup1GoiKf8qDL4vhDwQjojq6vp2g0Za5A7C5R6wm'
                  }
                  resolve(WeiXinMsg.musicMsg(fromUser, toUser, mContent))
                  break;
                case "语音":
                  let mid = "s9TbsYg1Ghx9Yur2OmD3adYS5RMgl-q5d9AZ5aVAaPomKLrFmNdn_v3eFfwNLaDm";
                  resolve(WeiXinMsg.voiceMsg(fromUser, toUser, mid));
                  break;
                case "视频":
                  let vContent = {
                    mediaId: 'i8RyXBrR3eIh1Wz1gvqUrTjP0Xx0d2e6B6sxoHSK6RUOazz0Livew7zauck00P7c',
                    title: '爱情公寓激昂篇',
                    description: '曾哥领衔主演',
                  }
                  resolve(WeiXinMsg.videoMsg(fromUser, toUser, vContent));
                  break;
                default:
                  resolve(WeiXinMsg.txtMsg(fromUser, toUser, '没有这个选项哦'));
                  break;
              }
            } else if (result.MsgType.toLowerCase() === "image") { // 用户消息类型是图片
              resolve(WeiXinMsg.imgMsg(fromUser, toUser, result.MediaId));
            } else if (result.MsgType.toLowerCase() === "voice") { // 用户消息类型是语音
              resolve(WeiXinMsg.voiceMsg(fromUser, toUser, result.MediaId)); // 获取用户发的语音返回给他
            } else if (result.MsgType.toLowerCase() === "video") { // 用户消息类型是视频
              resolve(WeiXinMsg.imgMsg(fromUser, toUser, result.ThumbMediaId));
            } else if (result.MsgType.toLowerCase() === "shortvideo") { // 用户消息类型是小视频
              resolve(WeiXinMsg.imgMsg(fromUser, toUser, result.ThumbMediaId));
            } else if (result.MsgType.toLowerCase() === "location") { // 用户消息类型是地理位置
              let locationMsg = "您所处的位置：经度" + result.Location_Y + "，纬度" + result.Location_X + "；详细地理位置：" + result.Label;
              resolve(WeiXinMsg.txtMsg(fromUser, toUser, locationMsg));
            } else if (result.MsgType.toLowerCase() === "link") { // 用户消息类型是链接
              resolve(WeiXinMsg.txtMsg(fromUser, toUser, result.Url));
            }
          }
        } else {
          //打印错误信息
          console.log(err);
        }
      })
    })
  })
}


/**
 * 上传（临时/永久）素材
 * @param {String} path 素材本地地址
 * @param {String} materialType 上传资源类型：image/thumb/voice/video
 * @param {Number} type 临时素材：0；永久素材：1
 */
WeChat.prototype.UploadMaterial = (path, materialType, type) => {
  return Material.UploadMaterial(path, materialType, type);
}

/**
 * 新增永久图文素材
 * @param {Object} news 图文对象
 */
WeChat.prototype.UploadPermNews = (news) => {
  return Material.UploadPermNews(news);
}

/**
 * 上传图文消息内的图片获取URL
 * @param {String} path 图片地址
 */
WeChat.prototype.uploadNewsPicture = (path) => {
  return Material.uploadNewsPicture(path);
}


/**
 * 下载（临时/永久）素材链接
 */
WeChat.prototype.getMaterialLink = () => {
  Material.downMaterial(0, "5npbcv0r2vjt2ER5Ah8vjK2u1yo4eW863B9-rK_cw_ad3DRZMSNWRMoLF1WJeHIx");
}

/**
 * 删除永久素材
 * @param {String} mediaId 素材媒体ID
 */
WeChat.prototype.deletePermMaterial = (mediaId) => {
  return Material.deletePermMaterial(mediaId);
}

/**
 * 获取永久素材总数
 */
WeChat.prototype.getPermMaterialAmount = () => {
  return Material.getPermMaterialAmount();
}

/**
 * 获取永久素材列表
 * @param {String} materialType 素材类型
 * @param {Number} offset 偏移量，0表示从第一个素材返回
 * @param {Number} count 返回素材数量
 */
WeChat.prototype.getPermMaterialList = (materialType, offset, count) => {
  return Material.getPermMaterialList(materialType, offset, count);
}


/**
 * 获取用户列表
 * @param {*} nextOpenId  下一个用户的openId
 */
WeChat.prototype.getUserList = (nextOpenId) => {
  return Users.getUserList(nextOpenId);
}

/**
 * 获取微信用户信息
 * @param {String} openId 关注者唯一ID
 * @param {String} lan 语言
 */
WeChat.prototype.getUserInfo = (openId, lan) => {
  return Users.getUserInfo(openId, lan);
}

/**
 * 批量获取用户基本信息（最多一次100条）
 * @param {*} openIdArr  用户 OpenId 列表
 */
WeChat.prototype.batchGetUserInfo = (openIdArr) => {
  return Users.batchGetUserInfo(openIdArr);
}


// 群发消息
WeChat.prototype.groupSendMessage = () => {
  return sending.groupSendMessage();
}


module.exports = WeChat;