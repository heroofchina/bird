var app = getApp()
var timeUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num : 0,
    date:'请选择时间',
    start:"请选择启用时间",
    customer:{},
    plate:null,
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    that.setData({
      id: options.id,
      plate: options.plate,
      date: options.remindTime
    })
    if (options.plate){
      that._info()
    }

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
  click : function (e){
    console.log(e)
    var that = this
    var mileage =e.detail.value;
    that.setData({
      mileage: mileage
    })
    },
  _selection: function (e) {
    console.log(e)
    var that = this
    var num = e.currentTarget.dataset.num
    var mileage = that.data.mileage
    var start = that.data.start
    if (num == that.data.num){
      that.setData({
        num: 0,
        date: '请选择时间'
      })
    } else {
      if (mileage && start){
        console.log("**********")
        var now = new Date()
        console.log(now)
        console.log(now.getFullYear())
        console.log(now.getMonth())
        console.log(now.getDay())
        var newstart = new Date(start)
        var day = (parseInt(now - newstart))
        console.log(day)
        var jun = 1
        if (mileage > 0 && day >0){
          jun = mileage / day
        }
        
        console.log(jun)
        console.log(num)
        var cha = (num /jun)
        console.log(cha)
        console.log(now.getTime())
        console.log(now.getTime() + cha)
        console.log()
        var newday = new Date(now.getTime() + cha)
        var y = newday.getFullYear()
        var m = newday.getMonth() + 1
        if (m < 10) {m = "0" + m};
        var d = newday.getDate()
        if (d < 10) {d = "0" + d}; 
        console.log(y + "-" + m + "-" + d)
        var i = y + "-" + m + "-" + d
        that.setData({
          date: i
        })
      }
      that.setData({
        num: num
      })
    }
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindStartChange: function (e) {
    this.setData({
      start: e.detail.value
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
          success: function (res) {
            that.setData({
              image :res.data
            })
            that._plate()
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  doClick: function (e) {
    var that = this
    var plate = e.detail.value;
    that.setData({
      plate: plate
    })
  },
  _plate:function(){
    var that = this
    var image = that.data.image
    wx.request({
      url: app.apiUrl + '/image/image',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        image: "E:/uploadImg/" + image
      },
      success: function (e) {
        const number = ((e.data || {}).words_result || {}).number
        number ? that.setData({
          plate: e.data.words_result.number
        }) : wx.showToast({
          icon: 'none',
          title: e.data.error_msg,
          duration: 2500
        })
      }
    })
  },
  _info:function(){
    var that = this
    var plate = that.data.plate
    wx.request({
      url: app.apiUrl + '/customer/getInfo',
      method: 'GET',
      data: {
        plate: plate
      },
      success: function (e) {
        var customer = e.data.data
        that.setData({
          customer: e.data.data,
          start: timeUtil.formatTimeTwo(customer.startTime, 'Y-M-D')
        })
        that._history()
      }
    })
  },
  /*_history: function () {
    var customer = this.data.customer
    if (customer.id){
      wx.navigateTo({
        url: '/pages/history/history?customerId=' + customer.id
      })
    } else {
      wx.showToast({
        title: '暂无历史',
        icon: '',
        image: '',
        duration: 1000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },*/
  _history: function () {
    const that = this
    var customer = this.data.customer
    wx.request({
      url: app.apiUrl + '/projectOrder/list',
      method: 'GET',
      data: { customerId: customer.id },
      success: function (e) {
        console.log(e.data.data)
        var list = e.data.data
        for(i=0; i<list.length; i++){
          const item = list[i]
          item.createTimeString = timeUtil.formatTimeTwo(item.createTime, 'Y/M/D');
          item.projectNameString = item.projectName.join();
        }
        that.setData({
          historyList: list 
        })
      }
    })
  },
  //冀BM1234
  formSubmit: function (e) {
    var that = this 
    var customer = that.data.customer
    var plate = e.detail.value.plate
    var name = e.detail.value.name 
    var phone = e.detail.value.phone
    var mileage = e.detail.value.mileage
    var note = e.detail.value.note
    var serviceId = that.data.id
    var startTime = that.data.start
    var remindTime = that.data.date
    var data = {}
    if (that.data.image) {
      var img = "https://chelingyu.mme5.com/uploadImg/" + that.data.image
      data.img = img
    }
    if(customer.id){
      data.id = customer.id
    } else {
      if (plate == "" || name == "" || phone == "" || mileage == "" || img == "" || serviceId == "" || startTime == "") {
        wx.showModal({
          title: '提示',
          content: '请填写除备注、进店提醒之外所有信息',
        })
        return;
      }
    }
    
    data.plate = plate
    data.name = name
    data.phone = phone
    data.note = note
    
    data.serviceId = serviceId
    data.startTime = startTime
    data.remindTime = remindTime
    data.mileage = mileage
    wx.request({
      url: app.apiUrl + '/customer/add',
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data:data,
      success: function (e) {
        var id = e.data.data
        wx.switchTab({
          url: '../index/index'
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