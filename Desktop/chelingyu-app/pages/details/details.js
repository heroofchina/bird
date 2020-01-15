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
    console.log(options.id)
    this.setData({
      id: options.id
    })
    this._demandinfo()
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
  _demandinfo: function(){
    var that = this
    var id = that.data.id
    wx.request({
      url: app.apiUrl + '/demand/getInfo',
      method: 'GET',
      data: {
        id: id
      },
      success: function (e) {
        console.log(e.data.demandList)
        var demandList = e.data.demandList
        demandList.createTime = timeUtil.formatTimeTwo(demandList.createTime, 'Y/M/D h:m:s');
        demandList.updateTime = timeUtil.formatTimeTwo(demandList.updateTime, 'Y/M/D h:m:s');
        that.setData({
          demandList: demandList
        })
        that._feedbackList()
      }
    })
  },
  _feedbackList: function () {
    var that = this
    var id = that.data.id
    wx.request({
      url: app.apiUrl + '/feedback/getlist',
      method: 'GET',
      data: {
        demandId: id
      },
      success: function (e) {
        console.log(e.data.list)
        that.setData({
          feedbackList: e.data.list
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