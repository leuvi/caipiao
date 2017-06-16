//index.js
var DATA = require('../../utils/data.js')

var app = getApp()
Page({
  data: {
    cur: 0,
    sort: ['双色球', '大乐透', '福彩3D', '排列3'],
    cache: {},
    percent: 0,
    isCompute: false,
    red: [],
    redToggle: {},
    blue: [],
    blueToggle: {},
    d3Bolls: {
      h: '',
      t: '',
      d: ''
    },
    result: {},
    ssq: {
      red: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33'],
      blue: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16']
    },
    dlt: {
      red: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
      blue: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    },
    d3: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  },
  onLoad: function () {
    var that = this
    console.log(app.globalData.userInfo.nickName)
  },
  tab(e) {
    const cur = e.currentTarget.dataset.id
    this.clearAllBolls()
    this.setData({cur})
  },
  selectRed(e) {
    const boll = e.currentTarget.dataset.boll
    if(this.data.red.some(v => v == boll)) {
      const toggle = this.data.redToggle
      toggle[boll] = false
      this.setData({
        red: this.data.red.filter(v => v != boll),
        redToggle: toggle
      })
    } else {
      switch (this.data.cur) {
        case 0:
          if (this.data.red.length == 6) {
            this.showToast('最多6个红球')
            return
          }
          break
        case 1:
          if (this.data.red.length == 5) {
            this.showToast('最多5个红球')
            return
          }
          break
      }
      const toggle = this.data.redToggle
      toggle[boll] = true
      this.setData({
        red: this.data.red.concat(boll),
        redToggle: toggle
      })
    }
  },
  selectBlue(e) {
    var boll = e.currentTarget.dataset.boll
    if (this.data.blue.some(v => v == boll)) {
      const toggle = this.data.blueToggle
      toggle[boll] = false
      this.setData({
        blue: this.data.blue.filter(v => v != boll),
        blueToggle: toggle
      })
    } else {
      switch (this.data.cur) {
        case 0:
          if (this.data.blue.length == 1) {
            this.showToast('最多1个蓝球')
            return
          }
          break
        case 1:
          if (this.data.blue.length == 2) {
            this.showToast('最多2个蓝球')
            return
          }
          break
      }
      const toggle = this.data.blueToggle
      toggle[boll] = true
      this.setData({
        blue: this.data.blue.concat(boll),
        blueToggle: toggle
      })
    }
  },
  selectD3(e) {
    var pos = e.currentTarget.dataset.pos
    var boll = e.currentTarget.dataset.boll
    var obj = Object.assign({}, this.data.d3Bolls)
    switch (pos) {
      case 'h':
        obj.h = boll
        break
      case 't':
        obj.t = boll
        break
      default:
        obj.d = boll
    }
    this.setData({
      d3Bolls: obj
    })
  },
  clearAllBolls() {
    if (this.data.isCompute) {
      this.showToast('请稍候..')
      return
    }
    this.setData({
      red: [],
      blue: [],
      redToggle: {},
      blueToggle: {},
      percent: 0,
      result: {},
      d3Bolls: {
        h: '',
        t: '',
        d: ''
      }
    })
  },
  showToast(str) {
    wx.showToast({
      title: str,
      duration: 1000
    })
  },
  shuffle(arr, pos) {
    for(let i = arr.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      const itemAtIndex = arr[randomIndex]
      arr[randomIndex] = arr[i]
      arr[i] = itemAtIndex
    }
    return arr.slice(0, pos).sort()
  },
  randomOne() {
    if (this.data.isCompute) {
      this.showToast('请稍候..')
      return
    }
    const redToggle = {}
    const blueToggle = {}
    const d3Bolls = {}
    let red, blue
    switch (this.data.cur) {
      case 0:
        red = this.shuffle(this.data.ssq.red, 6)
        blue = this.shuffle(this.data.ssq.blue, 1)
        break
      case 1:
        red = this.shuffle(this.data.dlt.red, 5)
        blue = this.shuffle(this.data.dlt.blue, 2)
        break
      default:
        d3Bolls.h = this.data.d3[~~(Math.random() * 10)]
        d3Bolls.t = this.data.d3[~~(Math.random() * 10)]
        d3Bolls.d = this.data.d3[~~(Math.random() * 10)]
    }
    if (this.data.cur < 2) {
      red.map(v => redToggle[v] = true)
      blue.map(v => blueToggle[v] = true)
      this.setData({ red, redToggle, blue, blueToggle, percent: 0, result: {} })
    } else {
      this.setData({ d3Bolls, percent: 0, result: {} })
    }
  },
  compute() {
    const self = this
    if (this.getCache()) {
      return
    }
    if (this.data.isCompute) {
      return
    }
    switch (this.data.cur) {
      case 0: //双色球
        if (!this.checkBolls('ssq')) {
          return
        }
        this.loopBolls({
          arr: DATA.ssq,
          redlength: 4,
          bluelength: 1
        })
        break
      case 1: //大乐透
        if (!this.checkBolls('dlt')) {
          return
        }
        this.loopBolls({
          arr: DATA.dlt,
          redlength: 3,
          bluelength: 2
        })
        break
      case 2: //福彩3D
        if (!this.checkBolls('d3')) {
          return
        }
        this.loopBolls({
          arr: DATA.fc3d,
          redlength: 3
        })
        break
      case 3: //排列3
        if (!this.checkBolls('d3')) {
          return
        }
        this.loopBolls({
          arr: DATA.pl3,
          redlength: 3
        })
        break
    }
  },
  loopBolls(config) {
    const self = this
    const red = [], blue = [], result = {}, cache = {}
    const {arr, redlength, bluelength} = config
    this.setData({
      isCompute: true
    })
    if(this.data.cur < 2) {
      arr.forEach(v => {
        if (this.checkSame(v.red, this.data.red, redlength)) {
          red.push(v.expect)
        }
        if (this.checkSame(v.blue, this.data.blue, bluelength)) {
          blue.push(v.expect)
        }
      })
      const probability = red.length * .1 / 50 + (blue.length >= 1 ? Math.floor(Math.random() * .1) : 0) + Math.random() * .1
      result.first = `${probability.toFixed(4)}%`
      result.suggest = `${~~(30 / probability)}期`
      cache[this.data.red.concat(this.data.blue).join('')] = result
    } else {
      const bolls = this.data.d3Bolls
      if (bolls.h == bolls.t && bolls.h == bolls.d) {
        const probability = Math.random() * .2 + .1
        result.first = `${probability.toFixed(4)}%`
        result.suggest = `${~~(100 / probability)}期`
      } else {
        arr.forEach(v => {
          if (this.checkSame(v.red, bolls, redlength)) {
            red.push(v.expect)
          }
        })
        const probability = red.length / 100 + Math.random() * 3
        result.first = `${probability.toFixed(4)}%`
        result.suggest = `${~~(100 / probability * 3)}期`
      }
      cache[bolls.h + bolls.t + bolls.d] = result
    }
    

    this.setProgress(function () {
      self.setData({
        result,
        cache: Object.assign(self.data.cache, cache)
      })
    })
  },
  checkBolls(sort) {
    switch (sort) {
      case 'ssq':
        if (this.data.red.length == 6 && this.data.blue.length == 1) {
          return true
        }
        break
      case 'dlt':
        if (this.data.red.length == 5 && this.data.blue.length == 2) {
          return true
        }
        break
      case 'd3':
        if (this.data.d3Bolls.h !== '' && this.data.d3Bolls.t !== '' && this.data.d3Bolls.d !== '') {
          return true
        }
        break
    }
    this.showToast('请选球~')
    return false
  },
  getCache() {
    let name = ''
    if(this.data.cur < 2) {
      name = this.data.red.concat(this.data.blue).join('')
    } else {
      name = this.data.d3Bolls.h + this.data.d3Bolls.t + this.data.d3Bolls.d
    }
    if (this.data.cache[name]) {
      this.setData({
        result: this.data.cache[name]
      })
      return true
    }
    return false
  },
  setProgress(fn, time = 2000) {
    var start = Date.now()
    var self = this
    anime()
    function anime() {
      var now = Date.now()
      var distance = now - start
      if (distance < time) {
        self.setData({
          percent: Math.floor(distance / 20)
        })
        setTimeout(anime, 20)
      } else {
        self.setData({
          percent: 100,
          isCompute: false
        })
        fn()
      }
    }
  },
  checkSame(arr1, arr2, num) {
    const newarr = []
    if(Array.isArray(arr2)) {
      arr1.forEach(v1 => {
        arr2.forEach(v2 => {
          if (v1 === v2) {
            newarr.push(v1)
          }
        })
      })
      return newarr.length >= num
    } else {
      if (arr1[0] !== arr2.h && arr1[1] !== arr2.t && arr1[2] !== arr2.d) {
        return true
      }
    }
    return false
  },
  onShareAppMessage: function () {
    return {
      title: '彩票概率预测',
      path: '/pages/index/index'
    }
  },
  toDetail(event) {
    var red, blue, query
    var first = this.data.result.first
    var suggest = this.data.result.suggest
    if (this.data.cur < 2) {
      red = this.data.red.join(',')
      blue = this.data.blue.join(',')
      query = '?first=' + first + '&suggest=' + suggest + '&type=' + this.data.sort[this.data.cur] + '&red=' + red + '&blue=' + blue
    } else {
      red = this.data.d3Bolls.h + ',' + this.data.d3Bolls.t + ',' + this.data.d3Bolls.d
      query = '?first=' + first + '&suggest=' + suggest + '&type=' + this.data.sort[this.data.cur] + '&red=' + red
    }
    wx.navigateTo({
      url: '../detail/detail' + query
    })
  },
})
