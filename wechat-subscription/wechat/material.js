/*
 * @Description: 素材管理
 * @Author: lizh 
 * @Date: 2018-11-21 14:43:14 
 * @Last Modified by: lizh
 * @Last Modified time: 2018-11-23 05:23:25
 */

const request = require('request')
const util = require('util')
const config = require('../config/config.json')
const token = require('../config/accessToken.json')
const fs = require('fs')
const path = require('path')


/**
 *  新增（上传）素材
 *  可以上传临时素材和永久素材，需要标明类型
 * @param {String} path 素材本地地址
 * @param {String} materialType 上传资源类型：image/thumb/voice/video
 * @param {Number} type 临时素材：0；永久素材：1
 */
exports.UploadMaterial = (path, materialType, type) => {
  var apiUrl = '';

  if (type == 0) { // 上传临时素材
    apiUrl = config.apiURL.uploadTempMaterial
  } else { // 上传永久素材
    apiUrl = config.apiURL.uploadPermMaterial
  } 

  return new Promise(resolve => {
    // 组装请求地址
    var url = util.format(apiUrl, config.apiDomain, token.access_token, materialType)
    // 发送数据
    var form = {
      media: fs.createReadStream(path) // 资源本地地址
    }
    // 上传文件
    request({
      url: url,
      method: 'POST',
      formData: form, // 以表单方式提交
      json: true
    }, (err, res, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}


/**
 * 新增永久图文素材
 * @param {Object} newsObj 图文对象
 */
exports.UploadPermNews = (newsObj) => {
  return new Promise((resolve, reject) => {
    let news = {
      articles: [{
          title: newsObj.title,   // 标题
          thumb_media_id: newsObj.tmid,  // 封面图片的mediaID
          author: newsObj.author,  // 作者
          digest: newsObj.digest,  // 摘要，多图文时为空
          show_cover_pic: 1, // 是否显示封面：1/0（显示/不显示）
          content: newsObj.content, // 正文内容，支持 HTML标签，不支持 JS，图片URL必须上传之后才能调用
          content_source_url: newsObj.sourceUrl, // 图文消息的原地址
          need_open_comment: newsObj.iscomment,  // 是否打开评论：1/0
          only_fans_can_comment: 1  // 是否粉丝才可评论：0-所有人，1-粉丝
        },
        //若新增的是多图文素材，则此处应还有几段articles结构
      ]
    }
    var url = util.format(config.apiURL.uploadGroupNews, config.apiDomain, token.access_token);

    request({
      url: url,
      method: 'POST',
      body: news,
      json: true,
      headers: {
        "content-type": "application/json"
      }
    }, (err, res, data) => {
      if (!err) {
        resolve(data)  // 返回媒体ID
      } else {
        reject(err)
      }
    })

  })
}


/**
 * 上传图文消息内的图片获取URL
 * @param {String} path 图片地址
 */
exports.uploadNewsPicture = (path) => {
  return new Promise(resolve => {
    var url = util.format(config.apiURL.uploadNewsPicture, config.apiDomain, token.access_token)
    var form = {
      media: fs.createReadStream(path) // 资源本地地址
    }
    // 上传文件
    request({
      url: url,
      method: 'POST',
      formData: form, // 以表单方式提交
      json: true
    }, (err, res, data) => {
      if (!err) {
        resolve(data.url)  // 获取图片的地址
      } else {
        reject(err)
      }
    })
  })
}


/**
 * 获取素材链接
 * @param {Number} type 永久：1；临时：0
 * @param {String} mediaId 素材媒体ID
 */
exports.getMaterialLink = (type, mediaId) => {
  let url = "";
  if (type == 0) { // 临时素材
    url = util.format(config.apiURL.getTempMaterial, config.apiDomain, token.access_token, mediaId)
  } else { // 永久素材
    url = util.format(config.apiURL.getPermMaterial, config.apiDomain, token.access_token)
  }
  return url;
}


/**
 * 直接下载/获取（临时/永久）素材
 */
exports.downMaterial = (type, mediaId) => {
  // let url = "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2432587304,4134874795&fm=26&gp=0.jpg";
  if (type == 0) { // 临时素材
    url = util.format(config.apiURL.getTempMaterial, config.apiDomain, token.access_token, mediaId)
  } else { // 永久素材
    url = util.format(config.apiURL.getPermMaterial, config.apiDomain, token.access_token)
  }

  let getpath = path.join(__dirname, '/media/reveive/')
  if (!fs.existsSync(getpath)) {
    fs.mkdirSync(getpath);
  }

  console.log('地址', url)

  request.get(url)
    .pipe(fs.createWriteStream(getpath))
}


/**
 * 删除永久素材
 * @param {String} mediaId 素材媒体ID
 */
exports.deletePermMaterial = (mediaId) => {
  return new Promise((resolve, reject) => {
    let data = {
      media_id: mediaId
    }
    let url = util.format(config.apiURL.deletePermMaterial, config.apiDomain, token.access_token)
    // 向上请求
    request({
      method: 'POST',
      url: url,
      body: data,
      json: true,
      headers: {
        "content-type": "application/json",
      }
    }, (err, res, result) => {
      console.log(result)
      if (!err) {
        if (result.errcode == 0) {
          resolve(result)
        } else {
          throw new Error('delete permanent material failed!');
        }
      } else {
        reject(err)
      }
    })
  })
}


/**
 * 获取永久素材总数
 */
exports.getPermMaterialAmount = () => {
  return new Promise(resolve => {
    let url = util.format(config.apiURL.getPermMaterialAmount, config.apiDomain, token.access_token)
    // 请求数目
    request.get(url, (err, res, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 获取永久素材列表
 * @param {String} materialType 素材类型
 * @param {Number} offset 偏移量，0表示从第一个素材返回
 * @param {Number} count 返回素材数量
 */
exports.getPermMaterialList = (materialType, offset, count) => {
  return new Promise((resolve, reject) => {
    let data = {
      type: materialType,
      offset: offset,
      count: count
    }
    let url = util.format(config.apiURL.getPermMaterialList, config.apiDomain, token.access_token)
    // 请求列表
    request.post({
      method: "POST",
      url: url,
      body: data,
      json: true,
      headers: {
        "content-type": "application/json",
      }
    }, (err, res, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(err)
      }
    })
  })
}