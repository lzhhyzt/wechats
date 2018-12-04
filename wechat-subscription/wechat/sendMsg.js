/*
 * @Description: 推送消息管理
 * @Author: lizh 
 * @Date: 2018-11-23 04:50:39 
 * @Last Modified by: lizh
 * @Last Modified time: 2018-11-23 05:40:39
 */

const request = require('request')
const util = require('util')
const config = require('../config/config.json')
const token = require('../config/accessToken.json')

// 群发消息（OpenID列表）
exports.groupSendMessage = () => {
  return new Promise((resolve, reject) => {
    // 需要发送的图文消息（测试号上不允许发送图文素材类型）
    let msg = {
      touser: ["oarAS1QGaixqjefaira9EhGRfFSY", "oarAS1QGaixqjefaira9EhGRfFSY"],  // 这里至少要两个OPenID
      mpnews: {
        media_id: "zIB4PE1cPwPexJGNhxGckV2lRGK6gMNTL0q3qthtj1U"
      },
      msgtype: "mpnews",
      send_ignore_reprint: 1
    }

    // 需要发送的文本消息（测试号中，文本、图片、语音、视频都可以测试群发，图文不行）
    let txt = {
      touser: ["oarAS1QGaixqjefaira9EhGRfFSY", "oarAS1QGaixqjefaira9EhGRfFSY"],
      msgtype: "text",
      text: { content: "哈喽啊!小金毛！"}
   }
    let req_url = util.format(config.sendMsg.groupSendMsg, config.apiDomain, token.access_token);
    // 请求
    request({
      url: req_url,
      method: "POST",
      json: true,
      body: msg,
      headers: {
        "content-type": "application/json"
      }
    }, (err, res, data) => {
      if (!err) {
        console.log('数据', data)
        resolve(data);
      } else {
        reject(err)
      }
    })
  })
}