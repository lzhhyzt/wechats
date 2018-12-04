/*
 * @Description: 公众号网页开发管理-js-sdk调用
 * @Author: lizh 
 * @Date: 2018-11-24 01:14:41 
 * @Last Modified by: lizh
 * @Last Modified time: 2018-11-24 01:52:10
 */

const request = require('request')
const util = require('util')
const config = require('../config/config.json')
const token = require('../config/accessToken.json')
const sign = require('../config/sign') // 生成签名
const fs = require('fs')
const jsapiTicket = require('../config/jsapiTicket.json')


/**
 * 
 * @param {string} url 需要调跳转的网页地址
 */
let getSignature = (url) => {
  return new Promise((resolve, reject) => {
    //获取当前时间 
    var currentTime = new Date().getTime();
    var req_url = util.format(config.jssdk.jsapiTicket, config.apiDomain, token.access_token);
    console.log('请求地址', req_url);
    //判断 本地存储的 jsapi_ticket 是否有效
    if (jsapiTicket.ticket === "" || jsapiTicket.expires_time < currentTime) {
      // 请求获取jsapi_ticket
      request.get(req_url, (err, res, data) => {
        data = JSON.parse(data)
        console.log(typeof data, data)
        if (!err && data.errcode == 0) {
          jsapiTicket.ticket = data.ticket;
          jsapiTicket.expires_time = new Date().getTime() + (parseInt(data.expires_in) - 200) * 1000;
          //更新本地存储的
          fs.writeFile('./config/jsapiTicket.json', JSON.stringify(jsapiTicket), function (err) {
            if (err) {
              console.error(err)
            }
          });
          // 生成签名
          resolve(sign(jsapiTicket.ticket, url));
        } else {
          reject(err);
        }
      })
    } else {
      resolve(sign(jsapiTicket.ticket, url))
    }
  })
}


module.exports = {
  getSignature: getSignature
}