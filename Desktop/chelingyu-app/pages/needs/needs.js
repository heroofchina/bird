// pages/feedback/feedback.js
var app = getApp();
var timeUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') //用户详情
    })
    this._demand()
    this._update()
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
  _demand: function (e) {
    var that = this
    var time = that.data.data
    var userInfo = that.data.userInfo
    wx.request({
      url: app.apiUrl + '/demand/list',
      method: 'GET',
      data: {
        serverId: userInfo.serviceUserVo.id
      },
      success: function (e) {
        console.log(e.data.list)
        var demand = e.data.list
        var d = []
        for(i=0;i<demand.length;i++){
          demand[i].createTime = timeUtil.formatTimeTwo(demand[i].createTime, 'Y/M/D h:m:s');
          demand[i].updateTime = timeUtil.formatTimeTwo(demand[i].updateTime, 'Y/M/D h:m:s');
          if (demand[i].count > 0){
            d.push(demand[i])
          }
        }
        that.setData({
          demand
        })
      }
    })
  },
  _update:function(){
    var that = this
    var userInfo = that.data.userInfo
    wx.request({
      url: app.apiUrl + '/feedback/updateStatus',
      method: 'GET',
      data: {
        salerId: userInfo.serviceUserVo.id
      },
      success: function (e) {
        console.log(e)
      }
    })
  },

  showDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/details/details?id=' + id
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