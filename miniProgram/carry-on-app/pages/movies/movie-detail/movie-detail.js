// pages/movies/movie-detail/movie-detail.js
var util = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化获取 movie 的id
    var movieId = options.id
    var url = app.globalData.doubanAPI + "/v2/movie/subject/" + movieId

    util.http(url, this.processDoubanData)
  },

  /**
   * 回调函数处理
   */
  processDoubanData: function (data) {
    if (!data) {
      return;
    }

    var director = {
      avatar: "",
      name: "",
      id: ""
    }

    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    }

    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join('、'),
      stars: util.coverToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.coverToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }

    this.setData({
      movie: movie
    })
  },

  /**
   * 图片预览（图片组）
   */
  viewMoviePostImg: function (event) {
    var src = event.currentTarget.dataset.src
    // var src2 = 'http://p4t7xi97p.bkt.clouddn.com/halipote.jpg'
    // var src3 = 'http://p4t7xi97p.bkt.clouddn.com/your-name.jpg'
    var src2 = '../../../images/movies/movie.jpg'
    var src3 = '../../../images/movies/yours.jpg'
    
    wx.previewImage({
      current: src,
      urls: [src, src2, src3],
    })
  }
})