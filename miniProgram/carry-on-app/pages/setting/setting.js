// pages/setting/setting.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    columns: [
      {
        icon: '/images/icons/share.png',
        title: '个人设置'
      },
      {
        icon: '/images/icons/store.png',
        title: '文章收藏'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = app.globalData.userInfo
    this.setData({
      userInfo: info
    })
  }
})