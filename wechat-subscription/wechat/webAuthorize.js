/*
 * @Description: 公众号网页开发管理-用户授权
 * @Author: lizh 
 * @Date: 2018-11-23 16:04:59 
 * @Last Modified by: lizh
 * @Last Modified time: 2018-11-24 01:17:04
 */

const request = require('request')
const util = require('util')
const config = require('../config/config.json')
const fs = require('fs')
const WebAccessToken = require('../config/webAccessToken.json')

/**
 * 同意授权，获取code地址
 * @param {String} redirect_url 重定向网页
 * @param {String} scope 应用授权作用域
 * @param {String} state 参数
 */
exports.getCodeUrl = (redirect_url, scope, state) => {
  let scopeArr = ["snsapi_base", "snsapi_userinfo"]
  let c_scope = scope === 1 ? scopeArr[1] : scopeArr[0];
  let url = util.format(config.webDevelop.oAuthUrl, config.appID, redirect_url, c_scope, state)
  return url;
}


// 网页授权获取用户信息
exports.OAuthUserInfo = (code) => {
  return new Promise((resolve, reject) => {
    let currentTime = new Date().getTime(); // 当前时间戳
    let url1 = util.format(config.webDevelop.getWebAccessToken, config.apiDomain, config.appID, config.appScrect, code);

    // 如果本地文件中没有则需要请求，否则不需要重新请求
    if (WebAccessToken.access_token == "" || WebAccessToken.expires_time < currentTime) {
      request.get(url1, (err, res, data) => {
        console.log(data)
        if (!err) {
          data = JSON.parse(data);
          WebAccessToken.access_token = data.access_token;
          WebAccessToken.openId = data.openid;
          WebAccessToken.expires_time = new Date().getTime() + (parseInt(data.expires_in) - 200) * 1000;
          //更新本地存储
          fs.writeFile('./config/webAccessToken.json', JSON.stringify(WebAccessToken), function (err) {
            if (err) {
              console.error(err)
            }
          });
          resolve(WebAccessToken);
        }
      })
    } else {
      resolve(WebAccessToken)
    }
  }).then(async (result) => {
    if (result) {
      let url2 = util.format(config.webDevelop.getUserInfo, config.apiDomain, result.access_token, result.openId);
      console.log('地址2', url2)
      var data = {};
      // 请求用户信息
      await request.get(url2, (err, res, body) => {
        if (!err) {
          console.log('用户信息', body)
          data = body;
        }
      })
      return await data
    }
  })
}


/**
 * 检验授权凭证（access_token）是否有效
 * @param {string} token 凭证
 * @param {number} openid 用户ID
 */
exports.checkAccessToken = (token, openid) => {
  return new Promise((resolve, reject) => {
    let url = util.format(config.webDevelop.checkAccessToken, apiDomain.apiDomain, token, openid);
    request.get(url, (err, res, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  })
}


/**
 * 刷新access_token（如果需要）
 * @param {*} refresh_token 
 */
exports.refreshAccessToken = (refresh_token) => {
  return new Promise((resolve, reject) => {
    let url = util.format(config.webDevelop.refreshToken, apiDomain.apiDomain, config.appID, refresh_token);
    request.get(url, (err, res, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  })
}