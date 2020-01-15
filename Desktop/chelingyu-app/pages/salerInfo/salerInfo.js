// pages/salerInfo/salerInfo.js
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
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      userInfo: wx.getStorageSync('userInfo'), //用户详情
    })
    this._info()
    this._browse()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  _info:function(){
    var that = this
    var id = that.data.id
    wx.request({
      url: app.apiUrl + '/wholesaler/getInfo',
      method: 'GET',
      data: {
        id: id,
      },
      success: function (e) {
        console.log(e)
        that.setData({
          saler:e.data.data
        })
      }
    })
  },
  /*_phone: function (e) {
    var that = this
    var id = that.data.id
    var phoneNumber = e.currentTarget.dataset.phone
    var openId = e.currentTarget.dataset.openId
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
    wx.request({
      url: app.apiUrl + '/times/addAndUpdate',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        salerId: id,
        contact: 1
      },
      success: function (e) {
        that._sendMsg(openId)
      }
    })
  },*/
  _phone: function (e) {
    var that = this
    var that = this
    wx.request({
      url: app.apiUrl + '/demand/adds',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        salerId: that.data.id,
        id: that.data.userInfo.serviceUserVo.id
      },
      complete: function (r) {
        console.log(e.currentTarget.dataset.phone)
        var phoneNumber = e.currentTarget.dataset.phone
        wx.makePhoneCall({
          phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
        })
      }
    })
  },
  
  _sendMsg: function (openId) {
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
  _browse:function(){
    var id= this.data.id
    wx.request({
      url: app.apiUrl + '/times/addAndUpdate',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        salerId: id,
        browse: 1
      },
      success: function (e) {
        console.log(e)
      }
    })
  },
  showImage() {
    const that = this
    wx.previewImage({
      urls: [that.data.saler.wholesalerVoWithBLOBs.img]
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})