// pages/video/video.js
import { links } from '../../config/url.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],    // 轮播列表
    videoList: [],     // 短视频列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 显示加载条
    wx.showLoading({
      title: '努力加载中',
      mask: true
    })

    // 请求所有短视频
    wx.request({
      url: links.video.allList,
      method: 'post',
      dataType: 'json',
      success: function (res) {
        let list = res.data.list;
        let swipers = [
          list[0],
          list[1],
          list[2]
        ]
        that.setData({
          videoList: list,
          swiperList: swipers
        })

        // 隐藏加载条
        wx.hideLoading();
      }
    })
  },

  /**
   * 短视频详情跳转
   */
  onMovieTap: function (event) {
    let id = event.currentTarget.dataset.vid
    let url = './video-detail/video-detail?id=' + id
    // 跳转到详情页面
    wx.navigateTo({
      url: url
    })
  }
})