var app = getApp()
Page({
  data: {
    first: null,
    suggest: null,
    _type: null,
    red: [],
    blue: []
  },
  onLoad(options) {
    this.setData({
      first: options.first,
      suggest: options.suggest,
      _type: options.type,
      red: options.red.split(','),
      blue: options.blue ? options.blue.split(',') : []
    })
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.userInfo.nickName + '分享了' + this.data._type + '1注',
      path: '/pages/index/index'
    }
  },
})