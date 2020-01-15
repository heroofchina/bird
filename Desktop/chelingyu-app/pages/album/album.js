// pages/album/album.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:[],
    photos:[]
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
    const index = e.currentTarget.dataset.index
    wx.showActionSheet({
      itemList: ['预览', '删除'],
      success(res) {
        const tapIndex = res.tapIndex
        switch(tapIndex) {
          case 0:
              wx.previewImage({
                current: image,
                urls: that.data.tempFilePaths
              })
            break
          case 1:
            that.data.tempFilePaths.splice(index, 1)
            that.setData({
              tempFilePaths: that.data.tempFilePaths
            })
            break
        }
      }
    })
  },
  _camera: function () {
    var that = this
    var tempFilePaths = that.data.tempFilePaths
    var photos = that.data.photos
    if (tempFilePaths.length >= 9){
      wx.showModal({
        title: '提示',
        content: '最多传9张主图',
      })
      return;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        tempFilePaths.push(res.tempFilePaths[0])
        that.setData({
          tempFilePaths: tempFilePaths
        })
        console.log(that.data.tempFilePaths)
        wx.uploadFile({
          url: 'https://chelingyu.mme5.com/upload/singleUpload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            photos.push("https://chelingyu.mme5.com/uploadImg/" + res.data)
            that.setData({
              photos: photos
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
    info.photos = that.data.photos
    console.log(info)
    wx.navigateTo({
      url: "/pages/license/license?info=" + JSON.stringify(info)
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