var app = getApp();

Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {}
  },
  goToIndex() {
    wx.switchTab({
      url: '../weather/weather',
    });
  },
  onLoad () {
    var that = this;
    wx.setNavigationBarTitle({
      title: `随身小宝`
    })

    //获取用户信息
    wx.getUserInfo({
      success: res => {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })

  },
  onReady () {
    setTimeout( () => {
      this.setData({
        remind: ''
      });
    }, 1000);
    // 重力感应
    wx.onAccelerometerChange( (res) => {
      let angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (this.data.angle !== angle) {
        this.setData({
          angle: angle
        });
      }
    });
  }
});