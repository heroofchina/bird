// pages/indexSearch/indexSearch.js
var app = getApp()
var timeUtil = require('../../utils/util.js');
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
    this.setData({
      userInfo: wx.getStorageSync('userInfo') //用户详情
    })
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
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var data = e.detail.value.search
    var userInfo = that.data.userInfo
    wx.request({
      url: app.apiUrl + '/customer/list',
      method: 'GET',
      data: {
        serviceId: userInfo.serviceUserVo.id,
        name: data
      },
      success: function (e) {
        console.log(e)
        var customer = e.data.data
        for (i = 0; i < customer.length; i++) {
          customer[i].customerVo.createTime = timeUtil.formatTimeTwo(customer[i].customerVo.createTime, 'Y/M/D');
          customer[i].customerVo.remindTime = timeUtil.formatTimeTwo(customer[i].customerVo.remindTime, 'Y/M/D');
          customer[i].customerVo.startTime = timeUtil.formatTimeTwo(customer[i].customerVo.startTime, 'Y/M/D');
          customer[i].customerVo.updateTime = timeUtil.formatTimeTwo(customer[i].customerVo.updateTime, 'Y/M/D');
          customer[i].customerVo.time = timeUtil.formatTimeTwo(customer[i].customerVo.time, 'Y/M/D');
        }
        that.setData({
          count: e.data.count,
          customer: e.data.data
        })
      }
    })
  },
  _phone: function (e) {
    console.log(e.currentTarget.dataset.phone)
    var phoneNumber = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
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