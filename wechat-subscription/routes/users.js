const router = require('koa-router')()
const wechat = require('../wechat/wechat')

router.prefix('/users');

var wechatApp = new wechat(); //实例wechat 模块

router.get('/getUserList',  (ctx, next) => {
  wechatApp.getUserList().then(result => {
    console.log('用户列表', result)
  })
})

router.get('/getUserInfo',  (ctx, next) => {
  wechatApp.getUserInfo("oarAS1QGaixqjefaira9EhGRfFSY").then(result => {
    console.log('用户信息', result)
  })
})

router.get('/batchGetUserInfo',  (ctx, next) => {
  let arr = ["oarAS1QGaixqjefaira9EhGRfFSY"]
  wechatApp.batchGetUserInfo(arr).then(result => {
    console.log('批量信息列表', result)
  })
})

module.exports = router
