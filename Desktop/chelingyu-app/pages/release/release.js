// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yewu: [
      {
        id: 1,
        name: '主营业务',
        check: false
      },
      {
        id: 2,
        name: '主营业务',
        check: false
      },
      {
        id: 3,
        name: '主营业务',
        check: false
      },
      {
        id: 4,
        name: '主营业务',
        check: false
      },
      {
        id: 5,
        name: '主营业务',
        check: false
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    var photos = (userInfo.serviceUserVo.photos).split(',')
    this.setData({
      userInfo: userInfo, //用户详情
      photos: photos
    })
    console.log(this.data.userInfo)
  },

  showDetail() {
    wx.navigateTo({
      url: '/pages/information/information'
    })
  },
  showImage(e) {
    const image = e.currentTarget.dataset.image
    const list = e.currentTarget.dataset.list
    wx.previewImage({
      current: image,
      urls: list
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