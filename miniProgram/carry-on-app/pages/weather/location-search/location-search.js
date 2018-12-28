// pages/weather/location-search/location-search.js
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentLocation: {},  // 当前位置
    searchValue: '',  // 输入值
    isShowCurrentLocation: true, // 显示搜索结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentLocation: options
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
  searchLocation: function (event) {
    let that = this;
    let value = this.data.searchValue;
    if (value !== '') {
      that.redirectToResult(value)
      
    } else {
      this.setData({
        isShowCurrentLocation: true,
      })
    }
  },

  /**
   * 返回前一页
   */
  navigationBackPage: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 重定向到结果页
   */
  redirectToResult: function(city) {
    if (city !=='') {
      /**
   * 判断输入城市名是否能查询得了天气
   */
      wx.request({
        url: 'https://free-api.heweather.com/s6/weather/forecast',
        method: 'GET',
        data: {
          location: city,
          key: '9b63c44b09fc44b8ae2406db1cfac487'
        },
        dataType: 'json',
        success: function (res) {
          if (res.data.HeWeather6[0].status == 'ok') {
            // 跳转到天气选项卡
            wx.reLaunch({
              url: '/pages/weather/weather?city=' + city
            })
          } else {
            // 没有该城市名
            wx.showModal({
              content: '该城市名不存在',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {}
              }
            });
          }
        }
      })
    }
  }

})