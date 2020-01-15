var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    i:0,
    tempFilePaths: null,
    tempFilePaths1: null
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
    this._cate()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.data)
    this.setData({
      vcateTitle: app.data.title,
      vcateId: app.data.vcateId
    })
  },
  formSubmit: function (e) {
    var that = this
    var list = that.data.list
    var i = that.data.i

    if (e.detail.value.title){
      list[i] = e.detail.value.title
      i++
      that.setData({ 
        list:list,
        i:i,
        isTrue: false,
        title : null
      });
    } else {
      wx.showModal({
        title: '',
        content: '请输入配件',
        showCancel: false,
        confirmText: "确定"
      })
    }
  },

  showImage(e) {
    const that = this
    const image = e.currentTarget.dataset.image
    const imageKey = e.currentTarget.dataset.imgkey
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
              that._cm(imageKey)
            break
        }
      }
    })
  },

  form: function (e) {
    var that = this
    var data = {}
    var userInfo = that.data.userInfo
    data.cateId = that.data.cateId
    data.vcateId = that.data.vcateId
    // data.salerId = userInfo.serviceUserVo.id
    var datevalues = +new Date()
    data.formId = datevalues.toString(16) + datevalues.toString(20) + datevalues.toString(25)
    if (that.data.list && that.data.list.length > 0) {
      data.list = that.data.list
    } else {
      wx.showModal({
        title: '',
        content: '请输入需求信息',
        showCancel: false,
        confirmText: "好的"
      })
      return false
    }
    data.serverId = userInfo.serviceUserVo.id
    if (that.data.image){
      data.img = that.data.image
    }
    if (that.data.img1){
      data.img1 = that.data.img1
    }
    data.code = e.detail.value.code
    that.setData({
      data : data
    })
    // that._salerList(that.data.vcateId)
    that._add()

  },
  _salerList: function (vcateId){
    var that = this
    wx.request({
      url: app.apiUrl + '/wholesaler/list',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        vcateId: vcateId
      },
      success: function (e) {
        console.log(e)
        var list = e.data.data
        for(i=0;i<list.length;i++){
          console.log(list[i].bs.openId)
          if (list[i].bs.openId != null && list[i].bs.openId != ""){
            that._sendMsg(list[i].bs.openId)
          }
        }
      }
    })

  },
  _sendMsg: function (openId) {
    var that = this
    var userInfo = that.data.userInfo
    wx.request({
      url: app.apiUrl + '/wx/msg/sendInquiry',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        openId: openId,
        title: userInfo.serviceUserVo.name
      },
      success: function (e) {
        console.log(e)
      }
    })
  },
  _add: function(e){
    var that = this
    var data = that.data.data
    wx.showLoading({
      title: '发布中'
    })
    wx.request({
      url: app.apiUrl + '/demand/add',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: data,
      success: function (r) {
        that._salerList(that.data.vcateId)
        that.setData({
          code:"",
          tempFilePaths:null,
          list:[]
        })
        wx.showModal({
          title: '提示',
          content: '询价添加完成',
          showCancel: false,
          success() {
            wx.navigateBack()
          }
        })
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  _delete: function (e){
    var index = e.currentTarget.dataset.index
    var that = this
    var list = that.data.list
    var i = that.data.i
    list.splice(index, 1);
    i--
    that.setData({
      list:list,
      i:i
    })
  }, 
  _deleteImage: function (e) {
    var that = this
    var tempFilePaths = that.data.tempFilePaths
    tempFilePaths.splice
    that.setData({
      tempFilePaths: {},
    })
  }, 
  _camera: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        wx.uploadFile({
          url: 'https://chelingyu.mme5.com/upload/singleUpload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function(res) {
            that.setData({
              img: "https://chelingyu.mme5.com/uploadImg/" + res.data
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },
  show: function () {
    this.setData({
      isTrue: true
    })
  },
  hide: function () {
    this.setData({
      isTrue: false
    })
  },
  _cate:function(){
    var that = this
    wx.request({
      url: app.apiUrl + '/cate/list',
      method: 'GET',
      success: function (e) {
        that.setData({
          cate: e.data.list,
          index: 0,
          cateId: e.data.list[0].id
        })
        that._vcate(e.data.list[0].id)
      }
    })
  },
  bindChange: function (e) {
    var index = e.detail.value
    var cate = this.data.cate
    this.setData({
      index: index,
      cateId: cate[index].id
    })
    this._vcate(cate[index].id)
  },
  _vcate: function (id) {
    var that = this
    var id = id
    wx.request({
      url: app.apiUrl + '/vcate/listInfo',
      method: 'GET',
      data: { cateId: id },
      success: function (e) {
        var data = e.data.data
        // var vcateTitle = that.data.vcateTitle
        // if (vcateTitle){

        // } else  {
        //   that.setData({
           
        //   })
        // }
        that.setData({
          vcate: data,
          vcateTitle: data[0].title,
          vcateId: data[0].id
        })
        // app.data.title = data[0].title
        // app.data.vcateId = data[0].vcateId
        app.data.title = that.data.vcateTitle
        app.data.vcateId = that.data.vcateId
      }
    })
  },
  _cm1() {
    this._cm('img1')
  },
  _cm: function (imageKey) {
    const isImage = !imageKey || !(typeof imageKey === 'string' && imageKey === 'img1')
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          [isImage ? 'filePaths' : 'filePaths1']: res.tempFilePaths
        })
        wx.uploadFile({
          url: 'https://chelingyu.mme5.com/upload/singleUpload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            that.setData({
              imageName: res.data,
              [isImage ? 'image' : 'img1']: "https://chelingyu.mme5.com/uploadImg/" + res.data
            })
            isImage ? that._vin() : null
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  _vin: function () {
    var that = this
    var image = that.data.image
    wx.request({
      url: app.apiUrl + '/image/vin',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        image: "E:/uploadImg/" + that.data.imageName
      },
      success: function (e) {
        const data = e.data || {}
        that.setData({
          vin: (data.words_result || [{}])[0].words
        })
      }
    })
  },
  //按住按钮
  /*startHandel: function() {
    wx.showToast({
      image: '/img/microphone.png',
      duration: 1000 * 60 * 60,
      title: '接收中'
    })
    this.setData({
      anmationShow: true,
      isShow:true
    })
    wx.getRecorderManager().start({
      duration: 10000
    })
    const self = this
    setTimeout(function() {
      self.setData({
        anmationShow: false
      })
    }, 10000);
  },
  //松开按钮
  endHandle: function() {
    // wx.navigateTo({
    //   url: '../search/search?word=' + result,
    // })
    // clearTimeout()
    wx.hideToast()
    this.setData({
      anmationShow: false,
      isShow: false
    })
    //录音停止函数
    var that = this;
    wx.getRecorderManager().onStop((res) => {
      // if (!this.data.inpvalue) {
      //   wx.showLoading({
      //     title: '语音识别中'
      //   })
      // }
      console.log(res)
      const {
        tempFilePath
      } = res; //这里松开按钮 会返回录音本地路径
      // 上传录制的音频到服务器
      wx.uploadFile({
        url: app.apiUrl + '/SASR/SASR', //接口地址
        method: 'POST',
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        filePath: res.tempFilePath,
        success: function(res) { //后台返回给前端识别后的文字
          var json = JSON.parse(res.data).result
          var r = JSON.stringify(json)
          var result =  r.slice(2, r.length-3)
          console.log(result)
          wx.navigateTo({
            url: '../search/search?word=' + result,
          })
        }
      })
    })
    //触发录音停止
    wx.getRecorderManager().stop()
  },*/

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