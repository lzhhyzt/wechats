// pages/diary/diary.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowLoading: false,
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  clickinput () {
    console.log('clickinput')
    this.setData({
      text: 'clickinput'
    })
  },

  clickbutton () {
    console.log('clickbutton')
    this.setData({
      text: 'clickbutton'
    })
  }
})
