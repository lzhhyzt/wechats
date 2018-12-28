// pages/music/new/new.js
import { links, QQMusic } from '../../../config/url.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    songList: [],  // 歌曲列表
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 播放音乐
     */
    playMusic: function(event) {
      let songInfo = event.currentTarget.dataset.song;
      // 触发父组件的事件，显示音乐控制面板
      this.triggerEvent('showcontrollers', songInfo, { bubbles: false} )
    }
  },

  created: function () {
    // 显示加载条
    wx.showLoading({
      title: '努力加载中',
      mask: true
    })
  },

  attached: function () {
    var that = this
    wx.request({
      url: QQMusic.newestMusic,
      method: "GET",
      dataType: "json",
      success: function (res) {
        let list = res.data.songlist;
        let subList = list.slice(0, 100);  // 取前100首歌曲
        that.setData({
          songList: subList
        })
        // 隐藏加载条
        wx.hideLoading();
      }
    })
  }
})
