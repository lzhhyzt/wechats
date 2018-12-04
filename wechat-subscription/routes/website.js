const router = require('koa-router')()
const wechat = require('../wechat/wechat')
const jssdk = require('../wechat/jssdk')

router.prefix('/website');

var wechatApp = new wechat(); //实例wechat 模块

// 前台请求签名
router.get('/signature', async (ctx, next) => {
  var data = {};
  await jssdk.getSignature('https://lzhhyzt123.cn/test/oauth.html').then( result => {
    data = result;
  })

  ctx.body = data;
})


module.exports = router