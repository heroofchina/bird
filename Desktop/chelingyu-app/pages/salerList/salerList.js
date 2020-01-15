// pages/salerList/salerList.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      vcateId: options.vcateId,
      cityId: options.cityId,
      title: options.title
    })
    wx.setNavigationBarTitle({
        title: options.title
    });
    this._salerList()
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
    this.setData({
      userInfo: wx.getStorageSync('userInfo') //用户详情
    })
  },
  showDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/salerInfo/salerInfo?id=' + id
    })
  },
  _salerList: function(e) {
    var that = this
    wx.showNavigationBarLoading()
    var cityId = that.data.cityId
    var vcateId = that.data.vcateId
    wx.request({
      url: app.apiUrl + '/wholesaler/list',
      method: 'GET',
      data: {
        cityId: cityId,
        vcateId: vcateId
      },
      success: function(e) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        console.log(e)
        const data = e.data.data || []
        that.setData({
          wholesaler: data
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this._salerList()
  },
  _phone: function(e) {
    var that = this
    var phoneNumber = e.currentTarget.dataset.phone
    var salerId = e.currentTarget.dataset.id
    var openId = e.currentTarget.dataset.openId
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
    wx.request({
      url: app.apiUrl + '/times/addAndUpdate',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        salerId: salerId,
        contact: 1
      },
      success: function (e) {
        that._sendMsg(openId)
      }
    })
  },
  _sendMsg: function (openId){
    var that = this 
    var userInfo = that.data.userInfo
    wx.request({
      url: app.apiUrl + '/wx/msg/sendContact',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        openId: openId,
        title: userInfo.serviceUserVo.name
      },
      success: function (e) {
        
      }
    })
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