// pages/recharge/recharge.js
var app = getApp()
var timeUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._list()
    var userInfo = wx.getStorageSync('userInfo')
    userInfo.serviceUserVo.vip = timeUtil.formatTimeTwo(userInfo.serviceUserVo.vip, 'Y/M/D h:m:s');
    this.setData({
      userInfo: userInfo //用户详情
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
  _list: function(){
    var that = this
    wx.request({
      url: app.apiUrl + '/vip/list',
      method: 'GET',
      success: function (e) {
        console.log(e.data.list)
        var list = e.data.list
        for (i = 0; i < list.length; i++){
          list[i].original = (list[i].original/100).toFixed(2)
          list[i].selling = (list[i].selling / 100).toFixed(2)
          that.setData({
            money: list[0].selling
          })
        }
        that.setData({
          list: list
        })
      }
    })
  },
  _selection: function (e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    var money = e.currentTarget.dataset.money
    that.setData({
      id: id,
      money: money
    })
  },
  _pay:function(){
    var that = this
    var id = that.data.id
    var money = that.data.money
    var userInfo = that.data.userInfo
    wx.request({
      url: app.apiUrl + '/mobile/pay/wechat/createOrder',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      data: {
        serviceId: userInfo.serviceUserVo.id,
        totalfee: money*100,
        vipId: id
      },
      success: function (e) {
        console.log(e)
      }
    })

  },
  goback() {
    wx.navigateBack()
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