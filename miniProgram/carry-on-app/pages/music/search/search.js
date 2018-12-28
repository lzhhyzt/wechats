// pages/music/search/search.js
var app = getApp();

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
    searchValue: '',
    tips: ['光年之外', '爱的就是你', '贝多芬的悲伤', '春风吹', '感觉自己萌萌哒', '你不懂', '吻得太逼真', '体面', '我的主题曲'],
    isShowSearchResult: false, // 是否显示查询结果
    searchList: [],
    isLove: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 点击提示词搜索
   */
    searchTab: function (e) {
      let that = this;
      let name = e.currentTarget.dataset.tip;
      let surl = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=' + name + '&g_tk=5381&jsonpCallback=SmartboxKeysCallbackmod_search68&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0';

      // 请求搜索
      wx.request({
        url: surl,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          let beginIndex = res.data.indexOf('(') + 1;
          let substr = res.data.substring(beginIndex, res.data.length - 1);
          let item = JSON.parse(substr).data.song.itemlist[0];

          let songInfo = {
            albumid: 4626990,
            songname: item.name,
            songid: item.id,
            songmid: item.mid,
            singer: [{
              name: item.singer
            }],
            picurl: '/images/icons/music-pan.png'
          };

          // 触发父组件的事件显示播放面板
          that.triggerEvent('showcontrollers', songInfo, { bubbles: false })
        }
      })
    },

    /**
     * 输入框输入数据
     */
    inputValue: function (e) {
      this.setData({
        searchValue: e.detail.value
      })
    },

    /**
     * 根据输出值执行查询
     */
    searchMusic: function (event) {
      let that = this;
      let value = this.data.searchValue;
      if (value !== '') {
        let surl = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=' + value + '&g_tk=5381&jsonpCallback=SmartboxKeysCallbackmod_search68&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0';
        // 请求搜索
        wx.request({
          url: surl,
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            let beginIndex = res.data.indexOf('(') + 1;
            let substr = res.data.substring(beginIndex, res.data.length - 1);
            let list = JSON.parse(substr).data.song.itemlist;
            // 添加序号
            for (let i = 0;i < list.length; i++) {
              list[i].key = i + 1
            }
            that.setData({
              isShowSearchResult: true,
              searchList: list
            })
          }
        })
      } else {
        this.setData({
          isShowSearchResult: false,
        })
      }
    },

    /**
     * 播放音乐
     */
    isPlayMusic: function (event) {
      let allInfo = event.currentTarget.dataset.song;
      let songInfo = {
        albumid: 4626990,
        songname: allInfo.name,
        songid: allInfo.id,
        songmid: allInfo.mid,
        singer: [{
          name: allInfo.singer
        }],
        picurl: '/images/icons/music-pan.png'
      };

      // 触发父组件的事件显示播放面板
      this.triggerEvent('showcontrollers', songInfo, { bubbles: false })
    },

    /**
     * 改变喜欢状态
     */
    isLoveMusic: function (event) {
      let single = event.currentTarget.dataset.single;
      let nickname = app.globalData.userInfo.nickName;  // 微信用户名

      // 点亮小心心
      let index = single.key;  // 获取歌曲序号
      let songlist = this.data.searchList;
      if (songlist[index - 1].isLove) {
        songlist[index - 1].isLove = false;
        // 将喜欢的歌曲从数据库中移除
        wx.request({
          method: 'post',
          url: 'http://127.0.0.1:3000/music/nolove',
          data: {
            nickname: nickname,  // 昵称
            songid: single.id,
          },
          dataType: 'json',
          success: function (res) { },
          fail: function () {
            console.log('失败')
          }
        })

      } else {
        songlist[index - 1].isLove = true;
        // 添加喜欢的歌曲进数据库
        wx.request({
          method: 'post',
          url: 'http://127.0.0.1:3000/music/love',
          data: {
            nickname: nickname,  // 昵称
            songname: single.name,
            songid: single.id,
            songmid: single.mid,
            singer: single.singer,
            albumid: 4626990
          },
          dataType: 'json',
          success: function (res) { },
          fail: function () {
            console.log('失败')
          }
        })
      }
      this.setData({
        searchList: songlist
      })
    }
  }
})
