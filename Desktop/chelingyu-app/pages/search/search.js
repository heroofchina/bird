// pages/indexSearch/indexSearch.js
var app = getApp()
var timeUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBar: {
      focus: false,
      value: null,
      searchBarClasses: 'weui-search-bar'
    },
    cityInfo: {}
  },

  /**
   * 点击
   */
  onClickSearchBar() {
    let newSearchBar = {
      focus: true,
      searchBarClasses: 'weui-search-bar weui-search-bar_focusing'
    };
    this.setData({
      searchBar: Object.assign(this.data.searchBar, newSearchBar)
    });
  },

  /**
   * 取消
   */
  onCancelSearchBar() {
    let newSearchBar = {
      value: null,
      focus: false,
      searchBarClasses: 'weui-search-bar'
    };
    this.setData({
      searchBar: Object.assign(this.data.searchBar, newSearchBar)
    });
  },

  /**
   * 点击清除图标
   */
  onClearSearchBar() {
    let newSearchBar = {
      value: null
    };
    this.setData({
      searchBar: Object.assign(this.data.searchBar, newSearchBar)
    });
  },

  /**
   * 输入框输入时
   */
  searchBarInput(event) {
    let newSearchBar = {
      value: event.detail.value
    };
    this.setData({
      searchBar: Object.assign(this.data.searchBar, newSearchBar)
    });
    console.log('======', event.detail)
    this.formSubmit(event.detail.value)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userInfo: wx.getStorageSync('userInfo'), //用户详情
      word: options.word,
      cityId:options.cityId,
      'searchBar.value': options.word
    })
    console.log(wx.getStorageSync('userInfo'))
    this.onClickSearchBar()
    this.formSubmit(options.word)
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

  showDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/salerInfo/salerInfo?id=' + id
    })
  },
  formSubmit: function (value) {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: app.apiUrl + '/common/search',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        // cityId: 0,
        cityId: that.data.cityId,
        text: value,
        pageSize: 9999,
        pageNum: 1
      },
      success: function (e) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        // var cityData = wx.getStorageSync('cityData') || {}
        var cityId = ~~that.data.userInfo.serviceUserVo.cityId || 0
        const data = e.data.data || []
        const upData = []
        const bottomData = []
        data.forEach(item => ~~item.cityId === cityId ? upData.push(item) : bottomData.push(item))
        that.setData({
          wholesaler: upData.concat(bottomData)
        })
      }
    })
  },
  _phone: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.request({
      url: app.apiUrl + '/demand/adds',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        salerId: id,
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