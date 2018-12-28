// pages/music/lyrics/lyrics.js
var app = getApp();
import { links } from '../../../config/url.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicInfo: {    // 歌曲信息
      type: Object
    },
    musicLycris: {  // 歌词
      type: Object
    },
    playStatus: {   // 播放状态
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal, changedPath) {
        this.setData({
          isPlay: newVal
        })
      }
    },
    loveStatus: {   // 喜欢状态
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        this.setData({
          isLove: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPlay: true,
    isLove: false,
    songInfo: {},
  },


  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 改变播放状态
     */
    changePlayStatus: function() {
      let isPlay = !this.data.isPlay;
      this.setData({
        isPlay: isPlay
      })
  
      this.triggerEvent('playPauseMusic', {}, { bubbles: false })
    },

    /**
     * 返回前一页
     */
    returnForward: function() {
      this.triggerEvent('hideLyricsControls', {}, { bubbles: false })
    },

    /**
     * 喜欢或者不喜欢
     */
    isLoveForMusic: function() {
      let love = !this.data.isLove
      let single = this.properties.musicInfo
      let nickname = app.globalData.userInfo.nickName;  // 微信用户名

      this.setData({
        isLove: love
      })

      if(love) {
        wx.request({
          method: 'post',
          url: links.music.love,
          data: {
            nickname: nickname,  // 昵称
            songname: single.songname,
            songid: single.songid,
            songmid: single.songmid,
            singer: single.singer[0].name,
            albumid: single.albumid
          },
          dataType: 'json',
          success: function (res) { },
          fail: function () {
            console.log('失败')
          }
        })
      } else {
        wx.request({
          method: 'post',
          url: links.music.noLove,
          data: {
            nickname: nickname,  // 昵称
            songid: single.songid,
          },
          dataType: 'json',
          success: function (res) { },
          fail: function () {
            console.log('失败')
          }
        })
      }
    }
  }
})