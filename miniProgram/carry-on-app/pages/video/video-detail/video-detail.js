// pages/video/video-detail/video-detail.js
import { links } from '../../../config/url.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vid: 0,
    video: {},
    recommentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = Number(options.id) - 1
    this.setData({
      vid: id
    })

    // 获取所有视频列表
    this.getAllVideo();
  },

  // 请求所有短视频
  getAllVideo: function () {
    var that = this

    wx.request({
      url: links.video.allList,
      method: 'post',
      dataType: 'json',
      success: function (res) {
        let list = res.data.list;
        // 筛选推荐列表
        let recommentList = that.filterRecommendList(list);

        that.setData({
          video: list[that.data.vid],
          recommentList: recommentList
        })
      }
    })
  },

  /**
   * 筛选推荐列表
   */
  filterRecommendList: function (list) {
    var se = new Set()
    for (let i = 0; i <= 9; i++) {
      let video = list[Math.floor(Math.random() * 9)]
      se.add(video)
    }
    var recommentList = [...se]
    return recommentList;
  },

  /**
   * 短视频详情跳转
   */
  onMovieTap: function (event) {
    let id = event.currentTarget.dataset.vid
    let url = './video-detail?id=' + id
    // 跳转到详情页面
    wx.navigateTo({
      url: url
    })
  }
})