// pages/information/information.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['请选择省市区', '', ''],
    mainBusinessIds: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo //用户详情
    })
    console.log(userInfo)
    this._project();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  _project: function(e) {
    var that = this
    var userInfo = that.data.userInfo
    console.log(userInfo.businessVos)
    wx.request({
      url: app.apiUrl + '/mainBusiness/list',
      method: "GET",
      success: function(r) {
        var list = r.data.data
        console.log(list)
        for (i = 0; i < list.length; i++) {
          if (userInfo.businessVos){
            for (j = 0; j < userInfo.businessVos.length; j++){
              if (list[i].id == userInfo.businessVos[j].id){
                list[i].check = true
              } 
            }
          } else {
            list[i].check = false
          }
        }
        that.setData({
          mainBusiness:list
        })
      }
    })

  },

  _selection: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var mainBusiness = that.data.mainBusiness[index]
    var mainBusinessIds = []
    mainBusiness.check = !mainBusiness.check
    for (i = 0; i < that.data.mainBusiness.length; i++) {
      if (that.data.mainBusiness[i].check) {
        mainBusinessIds.push(that.data.mainBusiness[i].id)
      }
    }
    that.setData({
      mainBusiness: that.data.mainBusiness,
      mainBusinessIds: mainBusinessIds
    })
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
  _camera: function() {
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
            that.setData({
              img: "https://chelingyu.mme5.com/uploadImg/" + res.data
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  formSubmit: function(e) {
    var that = this
    var info = {}
    info.id = that.data.userInfo.serviceUserVo.id
    info.name = e.detail.value.name
    info.address = e.detail.value.address
    info.contacts = e.detail.value.contacts
    info.phone = e.detail.value.phone
    info.wechat = e.detail.value.wechat
    info.region = that.data.region[2]
    info.img = that.data.img
    console.log(that.data.mainBusinessIds)
    if (that.data.mainBusinessIds.length > 0){
      info.mainBusinessIds = that.data.mainBusinessIds
    }
    wx.navigateTo({
      url: "/pages/album/album?info=" + JSON.stringify(info)
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})