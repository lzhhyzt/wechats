// pages/weather/weather.js
import { formatDate } from '../../utils/util.js'
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {}, // 地理位置
    weather: [], // 天气状况
    liveIndex: [] // 生活指数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 显示加载条
    wx.showLoading({
      title: '努力加载中',
      mask: true
    })

    if (options.city) {
      that.setData({
        location: options
      })
      // 调用方法
      that.searchWeather(options);

    } else {
      // 获取用户地理位置
      wx.authorize({
        scope: 'scope.record',
        success(res) {
          wx.getLocation({
            type: 'gcj02',
            success: function(res) {
              var qqmapsdk = new QQMapWX({
                key: 'KJABZ-L436P-JDCDI-VTHLW-BYXBQ-W2BSD' // 必填
              });

              // 从腾讯SDK中获取真实的地址信息
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success: function(addressRes) {
                  var address = addressRes.result.address_component;
                  that.setData({
                    location: address
                  })

                  // 调用方法
                  that.searchWeather(address);

                },
                fail: function(res) {
                  console.log(res)
                }
              })
            }
          })
        }
      })
    }
  },

  onReady: function() {
    let status = wx.getSetting({
      success: (res) => {
        console.log(res)
      }
    })
  },
  
  /**
   * 结合腾讯地图和和风天气API查询天气状况
   */
  searchWeather: function(address) {
    var that = this;
    /**
     * 请求天气状况：和风天气API
     */
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/forecast',
      method: 'GET',
      data: {
        location: address.city,
        key: '9b63c44b09fc44b8ae2406db1cfac487'
      },
      dataType: 'json',
      success: function(res) {
        var hweather = res.data.HeWeather6[0].daily_forecast
        hweather[0].day = '今天';
        hweather[1].day = '明天';
        hweather[2].day = '后天';
        hweather[0].date = formatDate(hweather[0].date);
        hweather[1].date = formatDate(hweather[1].date);
        hweather[2].date = formatDate(hweather[2].date);

        that.setData({
          weather: hweather
        })
      }
    })

    /**
     * 天气生活指数
     */
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/lifestyle',
      method: 'GET',
      data: {
        location: address.city,
        key: '9b63c44b09fc44b8ae2406db1cfac487'
      },
      dataType: 'json',
      success: function(res) {
        var live = res.data.HeWeather6[0].lifestyle
        that.setData({
          liveIndex: live
        })
      }
    })

    // 隐藏加载条
    wx.hideLoading();
  },

  /**
   * 跳转到地址搜索页面
   */
  searchLocation: function(e) {
    let location = e.currentTarget.dataset.locations
    wx.navigateTo({
      url: '/pages/weather/location-search/location-search?city=' + location.city + '&district=' + location.district + '&street=' + location.street,
    })
  }
})