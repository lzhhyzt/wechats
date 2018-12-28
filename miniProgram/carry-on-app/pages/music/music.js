// pages/music/music.js
var app = getApp();
import utils from '../../utils/util.js';
import { links, QQMusic } from '../../config/url.js';
const innerAudioContext = wx.createInnerAudioContext(); // 创建音频对象

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: [{
        img_off: '/images/icons/new_off.png',
        img_on: '/images/icons/new_on.png',
        title: '最新'
      },
      {
        img_off: '/images/icons/recommend_off.png',
        img_on: '/images/icons/recommend_on.png',
        title: '推荐'
      },
      {
        img_off: '/images/icons/search_off.png',
        img_on: '/images/icons/search_on2.png',
        title: '搜索'
      },
      {
        img_off: '/images/icons/mine_off.png',
        img_on: '/images/icons/mine_on.png',
        title: '我的'
      }
    ],
    currentTab: 0,
    list: [0, 1, 2, 3],
    constrolsIsShow: false, // 控制面板是否显示
    musicInfo: {}, // 正在播放的歌曲信息
    isPlay: true, // 是否正在播放音乐
    loveMusicList: [], // 喜欢的音乐
    lycris: {
      lycrisContent: [],      // 全部歌词内容
      lycrisTime: []       // 歌词时间
    },
    lycrisShort: {}, // 歌词短
    isShowLyrics: false,
    isLove: false,
    schedule: 0,   // 进度
    duration: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  /**
   * 播放音乐，显示自定义控制面板
   */
  showMusicControls: function(e) {
    let song = e.detail; // 获取从子组件传过来的数据
    song.picurl = "http://imgcache.qq.com/music/photo/album_300/" + song.albumid % 100 + "/300_albumpic_" + song.albumid + "_0.jpg";

    this.setData({
      musicInfo: song
    })

    innerAudioContext.autoplay = true; // 自动播放
    innerAudioContext.loop = true;   // 循环播放
    innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/C100' + song.songmid + '.m4a?fromtag=0&guid=126548448'

    // 获取歌词
    this.getLycris(song.songmid);
    
    // 播放错误
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
    })

    // 进度更新事件，传输歌词
    innerAudioContext.onTimeUpdate(() => {
      let contents = this.data.lycris.lycrisContent; // 内容
      let times = this.data.lycris.lycrisTime;  // 时间
      let currentTime = Math.ceil(innerAudioContext.currentTime)
      let duration = Math.ceil(innerAudioContext.duration)

      let progress = Math.ceil((currentTime / duration) * 100)
      
      // 设置进度
      this.setData({
        schedule: progress
      })

      for (var i = 0; i < times.length; i++) {
        if (Math.floor(currentTime) == Number(times[i])) {
          this.setData({
            lycrisShort: {
              forward: contents[i - 1],
              current: contents[i],
              backward: contents[i + 1]
            }
          })
        }
      }
    })

    // 能播放
    innerAudioContext.onCanplay (() => {
      this.setData({
        duration: innerAudioContext.duration
      })
      //console.log(innerAudioContext.duration)
    })

    // 播放
    innerAudioContext.onPlay(() => {
      this.setData({
        constrolsIsShow: true // 信息面板显示
      })
    })

    // 播放结束
    innerAudioContext.onEnded(() => {
      this.setData({
        constrolsIsShow: false // 信息面板不显示
      })
    })
  },

  /**
   * 手动隐藏音乐面板且停止音乐
   */
  hiddenControls: function() {
    this.setData({
      constrolsIsShow: false
    })

    // 停止音乐
    innerAudioContext.stop();
  },

  /**
   * 手动播放或者暂停音乐
   */
  playorpause: function() {
    let play = !this.data.isPlay;
    this.setData({
      isPlay: play
    })

    if (play) {
      innerAudioContext.play(); // 暂停
    } else {
      innerAudioContext.pause(); // 播放
    }
  },

  /**
   * 进入歌曲歌词页面
   */
  enterLyricPage: function(e) {
    var that = this
    let name = app.globalData.userInfo.nickName;
    let info = e.currentTarget.dataset.music;

    // 请求判断该歌曲是否标记为喜欢
    wx.request({
      method: 'post',
      url: links.music.isLove,
      dataType: 'json',
      data: {
        nickname: name,
        songid: info.songid
      },
      success: function(result) {
        if (result.data.count >= 1) {
          that.setData({
            isLove: true
          })
        } else {
          that.setData({
            isLove: false
          })
        }
      }
    })

    // 显示歌词面板
    that.setData({
      isShowLyrics: true
    })
  },

  /**
   * 获取歌词
   */
  getLycris: function(mid) {
    var that = this;
    wx.request({
      url: links.music.getLycris,
      method: 'post',
      dataType: 'json',
      data: {
        songid: mid  // 000HR0P22t9WL8
      },
      success: function (res) {
        let lyrics = res.data.lycris;
        let arr = lyrics.split('\n')
        let contents = [];
        let times = [];

        for (let i = 5; i < arr.length; i++) {
          let str = arr[i];
          let array = str.split(']');
          array[0] = array[0].substring(1, array[0].length);
          let time = utils.msChangeSeconds(array[0]);
          times.push(time);
          contents.push(array[1])
        }

        that.setData({
          lycris: {
            lycrisContent: contents,   // 歌词内容
            lycrisTime: times          // 歌词时间
          }
        })
      }
    })
  },

  /**
   * 隐藏播放面板
   */
  hideLyricsPane: function() {
    this.setData({
      isShowLyrics: false
    })
  }

})