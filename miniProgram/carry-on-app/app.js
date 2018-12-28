//app.js
import { links } from './config/url.js'

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              var info = res.userInfo
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = info

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              // 添加用户信息到服务器
              wx.request({
                method: 'post',
                url: links.users.signup,
                data: {
                  nickname: info.nickName,  // 昵称
                  sex: info.gender,         // 性别
                  address: info.province + ' ' + info.city, // 地址
                  avatar: info.avatarUrl   // 头像
                },
                dataType: 'json',
                success: function (res) {}
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    doubanAPI: "https://douban.uieee.com",  // 豆瓣API: https://douban.uieee.com
    location: {},
    mediaObject: ''  // 播放媒体对象
  }
})