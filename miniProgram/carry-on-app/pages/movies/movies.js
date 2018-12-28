// pages/movies/movies.js
var  util  = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inHots: {},
    commingSoon: {},
    top250: {},
    containerShow: true,
    searchPannelShow: false,
    searchResult: {},
    inputText: ''       // 输入框输入值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 显示加载条
    wx.showLoading({
      title: '努力加载中',
      mask: true
    })

    var baseUrl = app.globalData.doubanAPI
    var inHot = baseUrl + "/v2/movie/in_theaters" + "?start=0&count=3"
    var commingSoon = baseUrl + "/v2/movie/coming_soon" + "?start=0&count=3"
    var top250 = baseUrl + "/v2/movie/top250" + "?start=0&count=3"

    this.requestUrl(inHot, "inHot", "正在热映")              // 正在热映
    this.requestUrl(commingSoon, "commingSoon", "即将上映")  // 即将上映
    this.requestUrl(top250, "top250", "豆瓣Top250")          // top250
  },

  /**
   * 网络请求
   */
  requestUrl: function (url, settedKey, classifyTitle) {
    var that = this
    // 向豆瓣发起网络请求
    wx.request({
      url: url, // https://douban.uieee.com
      data: {},
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      success: function (res) {
        that.processSucessData(res.data, settedKey, classifyTitle)
        
        // 隐藏加载条
        wx.hideLoading();
      },
      fail: function (error) {
        console.log('失败', error)
      }
    })
  },

  /**
   * 成功处理函数
   */
  processSucessData: function (data, settedKey, classifyTitle) {
    var movies = []
    for (var idx in data.subjects) {
      var subject = data.subjects[idx]
      var title = subject.title
      if (title.length > 6) {
        title = title.substring(0, 6) + '...'
      }

      var temp = {
        title: title, // 标题
        average: subject.rating.average, // 评分
        coverageUrl: subject.images.large, // 封面图片
        movieId: subject.id,  // id
        stars: util.coverToStarsArray(subject.rating.stars), // 星星
      }
      movies.push(temp)
    }
    
    // 设置数据绑定
    var readyData = {}
    readyData[settedKey] = {
      movies: movies,
      classifyTitle: classifyTitle
    }
    this.setData(readyData)
  },

  /**
   * 更多电影出发事件
   */
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category // 获取自定义属性值
    wx.navigateTo({
      url: 'more-movies/more-movies?category=' + category,
    })
  },

  /**
   * 搜索框角度失去事件
   */
  onBindFocus: function () {
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },

  /**
   * 搜索框改动事件
   */
  onBindChange: function () {

  },

  /**
   * 输入框输入改变事件
   */
  onBindChange: function (event) {
    var value = event.detail.value
    var searchUrl = app.globalData.doubanAPI + "/v2/movie/search?q=" + value
    this.setData({
      inputText: value
    })
    // 请求
    this.requestUrl(searchUrl, 'searchResult', "")
  },

  /**
   * 关闭搜索页面
   */
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      searchResult: {},
      inputText: ''
    })
  },

  /**
   * 电影详情跳转
   */
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: './movie-detail/movie-detail?id=' + movieId
    })
  }

})