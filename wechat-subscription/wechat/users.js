/*
 * @Description: 用户管理
 * @Author: lizh 
 * @Date: 2018-11-22 18:36:45 
 * @Last Modified by: lizh
 * @Last Modified time: 2018-11-22 19:28:06
 */
const request = require('request')
const util = require('util')
const config = require('../config/config.json')
const token = require('../config/accessToken.json')


/**
 * 获取用户列表
 * @param {*} nextOpenId  下一个用户的openId
 */
exports.getUserList = (nextOpenId) => {
  return new Promise((resolve, reject) => {
    let req_url = "";
    if (nextOpenId) {
      req_url = util.format(config.userApi.getUserList, config.apiDomain, token.access_token, nextOpenId);
    } else {
      req_url = util.format(config.userApi.getUserNextList, config.apiDomain, token.access_token);
    }
    // 请求
    request.get(req_url, (err, res, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 获取微信用户信息
 * @param {String} openId 关注者唯一ID
 * @param {String} lan 语言
 */
exports.getUserInfo = (openId, lan = "zh_CN") => {
  return new Promise((resolve, reject) => {
    let req_url = util.format(config.userApi.getUserInfo, config.apiDomain, token.access_token, openId, lan);
    // 请求
    request.get(req_url, (err, res, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 批量获取用户基本信息（最多一次100条）
 * @param {*} openIdArr  用户 OpenId 列表
 */
exports.batchGetUserInfo = (openIdArr) => {
  return new Promise((resolve, reject) => {
    let user_list = [];
    openIdArr.forEach((value, index) => {
      var temp = {
        openid: value,
        lang: "zh_CN"
      }
      user_list.push(temp)
    })
    let list = {
      user_list: user_list
    }
    let req_url = util.format(config.userApi.batchGetUserInfo, config.apiDomain, token.access_token);
    // 请求
    request({
      url: req_url,
      method: "POST",
      json: true,
      body: list,
      headers: {
        "content-type": "application/json"
      }
    }, (err, res, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err)
      }
    })
  })
}
