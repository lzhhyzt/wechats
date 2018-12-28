// pages/music/recommend/recommend.js
var app = getApp();
import { links, QQMusic } from '../../../config/url.js';
import { isInArray, deleteElefromArray } from '../../../utils/util.js';

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
    isLove: false,
    list: [],       // 推荐歌曲列表
    loveList: [], // 喜欢音乐的ID
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 播放音乐
     */
    isPlayMusic: function(event) {
      let allInfo = event.currentTarget.dataset.song;
      let songInfo = {
        albumid: allInfo.albumid,
        songname: allInfo.songname,
        songid: allInfo.songid,
        songmid: allInfo.songmid,
        singer: allInfo.singer,
        picurl: '/images/icons/music-pan.png'
      };

      // 触发父组件的事件显示播放面板
      this.triggerEvent('showcontrollers', songInfo, { bubbles: false })
    },

    /**
     * 改变喜欢状态
     */
    isLoveMusic: function(event) {
      let single = event.currentTarget.dataset.single;
      let nickname = app.globalData.userInfo.nickName;  // 微信用户名

      // 点亮小心心
      let index = single.cur_count;  // 获取歌曲序号
      let songlist = this.data.list;
      if (songlist[index - 1].isLove) {
        songlist[index - 1].isLove = false;
        // 将喜欢的歌曲从数据库中移除
        wx.request({
          method: 'post',
          url: links.music.noLove,
          data: {
            nickname: nickname,  // 昵称
            songid: single.data.songid,
          },
          dataType: 'json', 
          success: function (res) {},
          fail: function () {
            console.log('失败')
          }
        })

      } else {
        songlist[index - 1].isLove = true;
        // 添加喜欢的歌曲进数据库
        wx.request({
          method: 'post',
          url: links.music.love,
          data: {
            nickname: nickname,  // 昵称
            songname: single.data.songname,
            songid: single.data.songid,
            songmid: single.data.songmid,
            singer: single.data.singer[0].name,
            albumid: single.data.albumid
          },
          dataType: 'json',
          success: function (res) {},
          fail: function () {
            console.log('失败')
          }
        })
      }
      this.setData({
        list: songlist
      })
    }
  },

  ready: function() {
    let that = this;

    // 请求推荐音乐列表
    wx.request({
      url: QQMusic.recommendMusic,
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        let songlist = res.data.songlist
        that.setData({
          list: songlist
        })
      }
    })
  }
})
