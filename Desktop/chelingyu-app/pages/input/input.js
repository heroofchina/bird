// pages/input/input.js
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
    console.log(options.customerId)
    var id = options.customerId
    that.setData({
      id: options.customerId
    })
    that._getList()
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

  _selection: function (e) {
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    var pindex = e.currentTarget.dataset.pindex
    var list = that.data.list[index]
    var projectId = []
    list.list[pindex].check = !list.list[pindex].check
    for (i = 0; i < that.data.list.length; i++) {
      for (j = 0; j < that.data.list[i].list.length; j++){
        if (that.data.list[i].list[j].check) {
          projectId.push(that.data.list[i].list[j].id)
        }
      }
    }
    that.setData({
      list: that.data.list,
      projectId: projectId
    })
  },
  _getList: function() {
    var that = this
    var plate = that.data.plate
    wx.request({
      url: app.apiUrl + '/project/list',
      method: 'GET',
      success: function (e) {
        var list = e.data.data
        for (i = 0; i < list.length; i++) {
          for (j = 0; j < list[i].list.length; j++){
            console.log(list[i].list[j])
            if (list[i].list[j].status == "1"){
              list[i].list.splice(j,1)
            } else{
              list[i].list[j].check = false
            }
            
          }
          that.setData({
            list: list
          })
        }
      }
    })
  },

  add:function(){
    var that = this 
    var projectId = that.data.projectId
    var id = that.data.id
    var data = {}
    data.projectId = projectId
    data.customerId = that.data.id
    // data.customerId = 1
    wx.request({
      url: app.apiUrl + '/projectOrder/add',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: data,
      success: function (e) {
        wx.switchTab({
          url: '/pages/index/index'
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