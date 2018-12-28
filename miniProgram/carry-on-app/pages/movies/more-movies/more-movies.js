// pages/movies/more-movies/more-movies.js
var app = getApp()
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    categoryTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category
    // 设置数据绑定
    this.setData({
      categoryTitle: category
    })

    var basePath = app.globalData.doubanAPI
    var dataUrl = ""
    switch (category) {
      case "正在热映":
        dataUrl = basePath + "/v2/movie/in_theaters"
        break;
      case "即将上映":
        dataUrl = basePath + "/v2/movie/coming_soon"
        break;
      case "豆瓣Top250":
        dataUrl = basePath + "/v2/movie/top250"
        break;
    }

    // 设置数据绑定
    this.setData({
      requestUrl: dataUrl
    })

    // 请求网络
    util.http(dataUrl, this.processData)
  },

  /**
   * 成功回调函数
   */
  processData: function (data) {
    var movies = []
    for (var idx in data.subjects) {
      var subject = data.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
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

    var totalMovies = []
    // 新加载数据和旧的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.setData({
        isEmpty: false
      })
    }

    // 数据累加
    var count = this.data.totalCount
    count += 20

    this.setData({
      movies: totalMovies,
      totalCount: count
    })

    // 加载动画结束
    wx.hideNavigationBarLoading()
    // 下拉刷新结束
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数
   */
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.categoryTitle
    })
  },

  /**
   * 上拉加载事件
   */
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"
    util.http(nextUrl, this.processData)
    // 加载动画开始
    wx.showNavigationBarLoading()
  },

  /**
   * 下拉刷新事件
   */
  onPullDownRefresh: function () {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20"
    // 重置数据绑定值
    this.setData({
      movies: [],
      isEmpty: true,
      totalCount: 0
    })
    util.http(refreshUrl, this.processData)
    wx.showNavigationBarLoading()
  },

   /**
   * 电影详情跳转
   */
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  }

})