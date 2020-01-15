// pages/license/license.js
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
    var that = this
    console.log(JSON.parse(options.info))
    that.setData({
      info: JSON.parse(options.info)
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
  showImage(e) {
    const that = this
    const image = e.currentTarget.dataset.image
    wx.showActionSheet({
      itemList: ['预览', '重新上传'],
      success(res) {
        const tapIndex = res.tapIndex
        switch(tapIndex) {
          case 0:
              wx.previewImage({
                urls: [image]
              })
            break
          case 1:
              that._camera()
            break
        }
      }
    })
  },
  _camera: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        wx.uploadFile({
          url: 'https://chelingyu.mme5.com/upload/singleUpload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            console.log(res)
            that.setData({
              license: "https://chelingyu.mme5.com/uploadImg/" + res.data
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    var info = that.data.info
    var license = that.data.license
    if (license){
      info.license = license
    }
  
    console.log(info)
    wx.request({
      url: app.apiUrl + '/serviceUser/update',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: info,
      success: function (r) {
        if (r.data.success) {
          wx.clearStorageSync()
          wx.setStorageSync("id", info.id)
          setTimeout((function () {
            wx.switchTab({
              url: "../index/index"
            })
          }).bind(this), 1000);
        } else {
          wx.showToast({ title: r.data.msg })
          that.setData({
            disabled: false
          })
        }
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