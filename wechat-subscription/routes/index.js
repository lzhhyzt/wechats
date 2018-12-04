const router = require('koa-router')()
const wechat = require('../wechat/wechat')
const token = require('../config/accessToken.json')
const menu = require('../config/menu.json')
const request = require('request')
const urlencode = require('urlencode')
const webAuthorize = require('../wechat/webAuthorize')

var wechatApp = new wechat(); //实例wechat 模块

router.get('/', async (ctx, next) => {
  let req = ctx.request

  // 连接微信公众号验证
  wechatApp.auth(req);
})

router.post('/', async (ctx, next) => {
  // 处理微信消息
  await wechatApp.handleMsg(ctx).then(function (result) {
    console.log(result)
    ctx.body = result
  });
});

// 测试获取access_token (预留接口)
router.get('/getAccessToken', async (ctx, next) => {
  wechatApp.getAccessToken().then(function (data) {
    console.log('获取AccessToken', data);
    // 创建菜单
    var url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + token.access_token
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
        // console.log(data)
      } else {
        console.error(error)
      }
    })
  });
})

// 上传素材预留接口
router.get('/getid', async (ctx, next) => {
  wechatApp.UploadMaterial('./media/roman.jpg', 'image', 1).then(result => {
    console.log('素材id', result)
  });
})

// 上传永久图文素材
router.get('/uploadMaterail', async (ctx, next) => {
  let news = {
    title: "青青草小屋的甜言蜜语",
    tmid: "zIB4PE1cPwPexJGNhxGckVPvxNXt6_pHLcjOtq1DHWw",
    author: "lzhhyzt",
    digest: "轻轻推开你的心扉，走进你的心里，去抚慰你那受伤的心灵，感受着伟大的情谊",
    content: "已曰秋日，暑气未散。日顺着山慢慢下滑，天边的云从白转黄，像穿久了白色的校服；再变红，那年满山的枫叶红艳艳；最终为灰，为黑，如同这谜样的黑夜，看不见星星的亮，这样的混沌，想要蒙蔽我的眼，心之所向。又一次测验结束了，难得从繁忙的学业中，有了空歇的时间。原本的班会改成了看电影，是《大鱼海棠》，国产的动漫我们坐在教室里，座位随意，老师并不强制。我坐在了靠近窗户的位置，可能是因为对电影的好奇心，其他人都坐在了教室的前面，她也坐在了靠近窗户的位置。“这电影我看过一遍，悲剧式的收尾。”我心里这样想着。把手放到了桌子上，不由自主的想起，我们前一天晚上密谋的事情。",
    sourceUrl: "https://www.wenjiwu.com/qingganmeiwen/122690.html",
    iscomment: 1
  }
  await wechatApp.UploadPermNews(news).then(result => {
    console.log('图文素材id', result)
  });
})

// 下载素材到本地
router.get('/download', async (ctx, next) => {
  await wechatApp.getMaterialLink()
})

// 删除永久素材预留接口
router.get('/deleteMaterial', async (ctx, next) => {
  await wechatApp.deletePermMaterial('G82WZs7j8H0EzeZQpzbwXhSHpXGaf7oJZ3GSFQ5L3cI2PDnhA0inK1r4hMN1ohAg')
    .then(data => {
      console.log('删除', data)
    });
})

// 获取永久素材总数预留接口
router.get('/getMaterialAmount', async (ctx, next) => {
  wechatApp.getPermMaterialAmount().then(data => {
    console.log('数目', data)
  });
})

// 获取永久素材列表预留接口
router.get('/getMaterailList', async (ctx, next) => {
  wechatApp.getPermMaterialList("image", 0, 10).then(data => {
    console.log('列表', data)
  });
})


// 群发消息
router.get('/groupSendMessage', async (ctx, next) => {
  wechatApp.groupSendMessage().then(data => {
    console.log('群发消息', data)
  });
})


router.get('/view', async (ctx, next) => {
  await ctx.render('index', {
    title: "热闹繁华的都市和静谧安静的乡村"
  })
})

router.get('/urlencode', async (ctx, next) => {
  let url = urlencode("https://lzhhyzt123.cn/test/oauth.html")
  console.log(url)
  ctx.body = url
})

// OAuth2验证获取用户信息
router.get('/getCode', async (ctx, next) => {
  let requrl = ctx.request.url
  let code = requrl.split('?')[1].split('=')[1].toString()
  console.log('代码', code)

  webAuthorize.OAuthUserInfo(code).then(result => {
    console.log('信息', result)
  })

  ctx.body = 5555
})
module.exports = router