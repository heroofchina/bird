// pages/register/register.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    region: ['请选择省市区', '', ''],
    account:null,
    msg:"获取验证码",
    b:false,
    data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
        title: '账号注册'
    });
    var account = options.account
    if (account){
      this.setData({
        account: account
      })
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
  countdown :function(){
    var that = this
    var msg = that.data.msg
    if (msg == 0) {
      that.setData({
        msg: "获取验证码",
        b: false
      });
      return;
    }
    var time = setTimeout(function () {
      that.setData({
        msg: msg - 1
      });
      that.countdown();
    }, 1000)
  },
  code:function(){
    var that = this 
    var account = that.data.account
    wx.request({
      url: app.apiUrl + '/common/sendSMS',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded"},
      data: {
        phoneNum: account
      },
      success: function (r) {
        console.log(r)
        if (r.data.success){
          that.setData({
            sessionid: r.data.data.sessionid,
            b:true,
            msg:60
          })
          that.countdown()
          console.log(that.data.sessionid)
        }
      },
      fail:function(r){

      }
    })
  },
  doClick: function (e) {
    console.log(e.detail.value)
    var that = this
    var account = e.detail.value;
    console.log(account)
    that.setData({
      account: account
    })
  },
  onGotUserInfo: function (e) {
    var that = this
    var data = that.data.data
    wx.login({
      success(res) {
        wx.request({
          url: app.apiUrl + '/decode/get',
          method: "POST",
          header: { "content-type": "application/x-www-form-urlencoded" },
          data: { 
            code: res.code,
            encryptedData:e.detail.encryptedData,
            iv:e.detail.iv
          },
          success: function (r) {
            data.openId = r.data.openId
            that.setData({
              data: data
            })
            that.add()
          }
        })
      }
    })
  },
  add: function () {
    var that = this
    var data = that.data.data
    var sessionid = that.data.sessionid
    console.log(sessionid)
    wx.request({
      url: app.apiUrl + '/serviceUser/add',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded", 'Cookie': 'JSESSIONID=' + sessionid  },
      data: data,
      success: function (r) {
        console.log(r)
        if (r.data.success){
          wx.clearStorageSync()
          wx.showToast({ title: "操作成功" })
          wx.setStorage({
            key: 'id',
            data: r.data.data,
          })
          setTimeout((function() {
            wx.switchTab({
              url: "/pages/index/index"
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
  
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var region = e.detail.value
    console.log(region[2])
    this.setData({
      region: region[2]
    })
  },

  formSubmit: function (e) {
    var that = this
    var code = e.detail.value.code
    var name = e.detail.value.name
    var password = e.detail.value.password
    var password1 = e.detail.value.password1
    var account = e.detail.value.account
    var checkbox = e.detail.value.checkbox[0]
    var region = that.data.region
    if (account == "" || account.length != 11){
      wx.showModal({
        title: '提示',
        content: '请输入正确手机号',
      })
      return;
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
      })
      return;
    }
    if (password == "" || password.length < 6) {
      wx.showModal({
        title: '提示',
        content: '请输入不少于6位的密码',
      })
      return;
    }
    if (password1 == "") {
      wx.showModal({
        title: '提示',
        content: '请确认密码',
      })
      return;
    }
    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请输入名称',
      })
      return;
    }
    if (checkbox == "") {
      wx.showModal({
        title: '提示',
        content: '请勾选下方协议',
      })
      return;
    }
    if (password != password1){
      wx.showModal({
        title: '提示',
        content: '输入密码不一致',
      })
      return;
    }
    var data = that.data.data
    data.code = code
    data.name = name
    data.password = password
    data.account = account
    data.region = region
    that.setData({
      disabled: true
    })
    that.setData({
      data:data
    })
    // wx.request({
    //   url: app.apiUrl + '/serviceUser/add',
    //   method: "POST",
    //   header: { "content-type": "application/x-www-form-urlencoded" },
    //   data: data,
    //   success: function (r) {
    //     console.log()
    //     if (r.data.success){
    //       wx.showToast({ title: "操作成功" })
    //       setTimeout((function() {
    //         wx.switchTab({
    //           url: "/pages/index/index"
    //         })
    //       }).bind(this), 1000);
    //     } else {
    //       wx.showToast({ title: r.data.msg })
    //       that.setData({
    //         disabled: false
    //       })
    //     }
    //   }
    // })
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