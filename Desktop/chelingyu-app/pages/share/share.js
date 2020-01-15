// pages/share/share.js
var app = getApp()
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
    userInfo: {},
    photos: null,
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    var userInfo = wx.getStorageSync('userInfo') || {}
    if (id) {
      this.setData({
        id: options.id
      })
      this.getInfo(userInfo.serviceUserVo.id)
      return
    }
    var photos = (userInfo.serviceUserVo.photos).split(',')
    this.setData({
      userInfo: userInfo, //用户详情
      photos: photos
    })
    console.log(this.data.userInfo)
  },
  getInfo(id) {
    const that = this
    if (!id) {
      wx.showModal({
        title: '提示',
        content: '请确认登录系统后进行查看',
        showCancel: false,
        success() {
          wx.navigateTo({
            url: '/pages/land/land'
          })
        }
      })
      return
    }
    wx.request({
      url: app.apiUrl + '/serviceUser/info',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data:{
        id: that.data.id
      },
      success: function (e) {
        if (e.data.success){
          const data = e.data.data || {}
          that.setData({
            userInfo: data, //用户详情
            photos: (data.serviceUserVo.photos || '').split(',')
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '获取用户信息失败',
            showCancel: false,
            success() {
              wx.navigateTo({
                url: '/pages/land/land'
              })
            }
          })
        }
      }
    })
  },
  _phone: function (e) {
    var that = this
    var userInfo = that.data.userInfo
    var phoneNumber = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
    // wx.request({
    //   url: app.apiUrl + '/scoreDetail/add',
    //   method: 'POST',
    //   header: { "content-type": "application/x-www-form-urlencoded" },
    //   data: {
    //     serviceId: userInfo.serviceUserVo.id,
    //     signId: 1
    //   },
    // })
  },

  gohome() {
    wx.switchTab({
      url: '/pages/index/index'
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
    const info = wx.getStorageSync('userInfo') || {}
    console.log(JSON.stringify(info))
    return {
      title: info.serviceUserVo.name,
      path: `/pages/share/share?id=${info.serviceUserVo.id}`,
      imageUrl: info.serviceUserVo.img,
      success() {
          wx.showToast({
              title: '分享成功'
          });
      }
    };
  }
})