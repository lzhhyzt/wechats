/*
 * @Description: 回复消息管理
 * @Author: lizh 
 * @Date: 2018-11-21 14:43:32 
 * @Last Modified by: lizh
 * @Last Modified time: 2018-11-21 22:48:09
 */

'use strict'

/**
 * 回复文本消息
 * @param {*} toUser 接收方
 * @param {*} fromUser 发送方
 * @param {*} content 文本内容
 */
exports.txtMsg = function (toUser, fromUser, content) {
  var xmlContent = "<xml><ToUserName><![CDATA[" + toUser + "]]></ToUserName>";
  xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
  xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  xmlContent += "<MsgType><![CDATA[text]]></MsgType>";
  xmlContent += "<Content><![CDATA[" + content + "]]></Content></xml>";
  return xmlContent;
}

/**
 * 回复图文消息
 * @param {*} toUser 接收方
 * @param {*} fromUser 发送方
 * @param {Array} contentArr 图文内容
 */
exports.graphicMsg = function (toUser, fromUser, contentArr) {
  var xmlContent = "<xml><ToUserName><![CDATA[" + toUser + "]]></ToUserName>";
  xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
  xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  xmlContent += "<MsgType><![CDATA[news]]></MsgType>";
  xmlContent += "<ArticleCount>" + contentArr.length + "</ArticleCount>";
  xmlContent += "<Articles>";
  contentArr.map(function (item, index) {
    xmlContent += "<item>";
    xmlContent += "<Title><![CDATA[" + item.Title + "]]></Title>";
    xmlContent += "<Description><![CDATA[" + item.Description + "]]></Description>";
    xmlContent += "<PicUrl><![CDATA[" + item.PicUrl + "]]></PicUrl>";
    xmlContent += "<Url><![CDATA[" + item.Url + "]]></Url>";
    xmlContent += "</item>";
  });
  xmlContent += "</Articles></xml>";
  return xmlContent;
}


/**
 * 回复图片消息
 * @param {*} toUser 接收方
 * @param {*} fromUser 发送方
 * @param {*} mediaId 素材id
 */
exports.imgMsg = function (toUser, fromUser, mediaId) {
  var xmlContent = "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
  xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
  xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  xmlContent += "<MsgType><![CDATA[image]]></MsgType>";
  xmlContent += "<Image>";
  xmlContent += "<MediaId><![CDATA["+ mediaId +"]]></MediaId>";
  xmlContent += "</Image></xml>";
  return xmlContent;
}

/**
 * 回复语音消息
 * @param {*} toUser 接收方
 * @param {*} fromUser 发送方
 * @param {*} mediaId 素材id
 */
exports.voiceMsg = function (toUser, fromUser, mediaId) {
  var xmlContent = "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
  xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
  xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  xmlContent += "<MsgType><![CDATA[voice]]></MsgType>";
  xmlContent += "<Voice><MediaId><![CDATA["+ mediaId +"]]></MediaId></Voice></xml>";
  return xmlContent;
}

/**
 * 回复音乐消息
 * @param {*} toUser 接收方
 * @param {*} fromUser 发送方
 * @param {Object} contentArr 音乐详情
 */
exports.musicMsg = function (toUser, fromUser, contentObj) {
  var xmlContent = "<xml><ToUserName><![CDATA[" + toUser + "]]></ToUserName>";
  xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
  xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  xmlContent += "<MsgType><![CDATA[music]]></MsgType>";
  xmlContent += "<Music>";
  xmlContent += "<Title><![CDATA[" + contentObj.title + "]]></Title>";
  xmlContent += "<Description><![CDATA[" + contentObj.description + "]]></Description>";
  xmlContent += "<MusicUrl><![CDATA[" + contentObj.musicUrl + "]]></MusicUrl>";
  xmlContent += "<HQMusicUrl><![CDATA["+ contentObj.HQMusicUrl +"]]></HQMusicUrl>";
  xmlContent += "<ThumbMediaId><![CDATA[" + contentObj.mediaId + "]]></ThumbMediaId>";
  xmlContent += "</Music></xml>";
  return xmlContent;
}

/**
 * 回复视频消息
 * @param {*} toUser 接收方
 * @param {*} fromUser 发送方
 * @param {Object} contentArr 视频详情
 */
exports.videoMsg = function (toUser, fromUser, contentObj) {
  var xmlContent = "<xml><ToUserName><![CDATA[" + toUser + "]]></ToUserName>";
  xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
  xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  xmlContent += "<MsgType><![CDATA[video]]></MsgType>";
  xmlContent += "<Video>";
  xmlContent += "<MediaId><![CDATA["+ contentObj.mediaId +"]]></MediaId>";
  xmlContent += "<Title><![CDATA[" + contentObj.title + "]]></Title>";
  xmlContent += "<Description><![CDATA[" + contentObj.description + "]]></Description>";
  xmlContent += "</Video></xml>";
  return xmlContent;
}
