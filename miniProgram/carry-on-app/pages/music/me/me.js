// pages/music/me/me.js
var app = getApp();
import { links } from '../../../config/url.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loveMusic: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loveList: [],
    columns: [
      {
        key: 1,
        icon: '/images/music/my-love.png',
        title: '我的喜欢'
      },
      {
        key: 2,
        icon: '/images/music/download.png',
        title: '我的下载'
      }
    ],
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 播放音乐
     */
    isPlayMusic: function (event) {
      let allInfo = event.currentTarget.dataset.song;
      let songInfo = {
        albumid: 961856,
        songname: allInfo.songname,
        songid: allInfo.songid,
        songmid: allInfo.songmid,
        singer: [{
          name: allInfo.singer
        }],
        picurl: '/images/icons/music-pan.png'
      };


      // 触发父组件的事件显示播放面板
      this.triggerEvent('showcontrollers', songInfo, { bubbles: false })
    },

    /**
     * 我的喜欢
     */
    loveMusic: function(e) {
      let show = !this.data.isShow;
      this.getLoveMusicList();
      this.setData({
        isShow: show
      })
    },

    /**
     * 我的下载
     */
    download: function() {
      
    },

    /**
     * 请求获取我喜欢的音乐
     */
    getLoveMusicList: function() {
      let that = this
      wx.request({
        method: 'post',
        url: links.music.loveList,
        dataType: 'json',
        data: {
          nickname: app.globalData.userInfo.nickName
        },
        success: function(res){
          that.setData({
            loveList: res.data.list
          })
        }
      })
    },

    /**
     * 移除我喜欢的音乐
     */
    removeLoveMusic: function(e) {
      let sid = e.currentTarget.dataset.sid;
      let nickname = app.globalData.userInfo.nickName
      // 将喜欢的歌曲从数据库中移除
      wx.request({
        method: 'post',
        url: links.music.noLove,
        data: {
          nickname: nickname,  // 昵称
          songid: sid,
        },
        dataType: 'json',
        success: function (res) { },
        fail: function () {
          console.log('失败')
        }
      })

      // 从新获取喜欢列表
      this.getLoveMusicList();
    }
  }
})
