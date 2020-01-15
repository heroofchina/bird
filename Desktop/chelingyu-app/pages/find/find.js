// pages/find/find.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['河北省', '唐山市', '路北区'],
    id: 1,
    banner:[],
    searchBar: {
      focus: false,
      value: null,
      searchBarClasses: 'weui-search-bar'
    },
    timer: null
  },

  /**
   * 点击
   */
  onClickSearchBar() {
    const that = this
    wx.navigateTo({
      url: '/pages/search/search?cityId=' + that.data.cityId
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
    })
    this._cateList()
    this._cityInfo()
    this._banner()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  _city: function(e) {
    var that = this
    var region = that.data.region
    wx.request({
      url: app.apiUrl + '/city/info',
      method: 'GET',
      data: { region: region[1]},
      success: function (e) {
        that.setData({
          cityId: e.data.data.id
        })
      }
    })
  },
  _banner: function (e) {
    var that = this
    var banner = that.data.banner
    wx.request({
      url: app.apiUrl + '/banner/list',
      method: 'GET',
      success: function (e) {
        console.log(e.data.data)
        for (i = 0; i < e.data.data.length; i++){
          if (e.data.data[i].position == 0 && e.data.data[i].status == "0"){
            banner.push(e.data.data[i])
          }
        }
        that.setData({
          banner :banner
        })
        console.log(that.data.banner)
      }
    })
  },
  showSalerInfo(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/salerInfo/salerInfo?id=' + id
    })
  },
  _cityInfo: function (e) {
    var that = this
    var userInfo = that.data.userInfo
    wx.request({
      url: app.apiUrl + '/city/getInfo',
      method: 'GET',
      data: { id: userInfo.serviceUserVo.cityId },
      success: function (e) {
        that.setData({
          cityId: userInfo.serviceUserVo.cityId,
          region: [e.data.data.proName || '--', e.data.data.name || '--']
        })
      }
    })
  },
  _selection: function(e) {
    var that = this
    var id = e.target.dataset.id
    that.setData({
      id: id
    })
    that._vcateList(id)
  },
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
    this._city()
  },
  _cateList: function(e) {
    var that = this
    wx.request({
      url: app.apiUrl + '/cate/list',
      method: 'GET',
      success: function(e) {
        var cateList = e.data.list
        that.setData({
          cateList: cateList
        })
        that._vcateList(cateList[0].id)
      }
    })
  },
  _vcateList: function(id) {
    var that = this
    var cateId = id
    wx.request({
      url: app.apiUrl + '/vcate/list',
      method: 'GET',
      data: {
        cateId: cateId
      },
      success: function(e) {
        console.log(e)
        var vcateList = e.data.data
        that.setData({
          vcateList: vcateList
        })
      }
    })
  },
  //按住按钮
  startHandel: function() {
    const timer = setTimeout(() => {
      wx.showToast({
        image: '/img/microphone.png',
        duration: 1000 * 60 * 60,
        title: '接收中'
      })
      clearTimeout(timer)
    }, 500)
    this.setData({
      anmationShow: true,
      isShow: true,
      timer: timer
    })
    wx.getRecorderManager().start({
      duration: 10000
    })
    const self = this
    setTimeout(function() {
      self.setData({
        anmationShow: false
      })
    }, 10000);
  },
  //松开按钮
  endHandle: function() {
    // wx.navigateTo({
    //   url: '../search/search?word=' + result,
    // })
    // clearTimeout()
    this.data.timer ? clearTimeout(this.data.timer) : null
    wx.hideToast()
    this.setData({
      anmationShow: false,
      isShow: false
    })
    //录音停止函数
    var that = this;
    wx.getRecorderManager().onStop((res) => {
      // if (!this.data.inpvalue) {
      //   wx.showLoading({
      //     title: '语音识别中'
      //   })
      // }
      console.log(res)
      const {
        tempFilePath
      } = res; //这里松开按钮 会返回录音本地路径
      // 上传录制的音频到服务器
      wx.uploadFile({
        url: app.apiUrl + '/SASR/SASR', //接口地址
        method: 'POST',
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        filePath: res.tempFilePath,
        success: function(res) { //后台返回给前端识别后的文字
          console.log('=====', res)
          var json = JSON.parse(res.data).result
          var r = JSON.stringify(json)
          var result =  r.slice(2, r.length-3)
          console.log(result)
          wx.navigateTo({
            url: '../search/search?word=' + result + '&cityId=' + that.data.cityId,
          })
        }
      })
    })
    // 错误提示
    wx.getRecorderManager().onError(function (res) {
      console.log('onError');
      console.log(JSON.stringify(res));
    });
    //触发录音停止
    wx.getRecorderManager().stop()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})