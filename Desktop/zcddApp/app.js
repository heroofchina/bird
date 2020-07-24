//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    const deviceInfo = wx.getSystemInfoSync();
    console.log('当前设备信息:::', deviceInfo);
    var isX = deviceInfo.model;
    isX = isX.substring(0, 8);
    if (typeof isX === "undefined") {
      return false;
    }
    if (isX === 'iPhone X') {
      this.globalData.isiphonex = true;
    }
  },
  globalData: {
    userInfo: null,
    isiphonex: false,
    token_type: '',  //全局的accesstoken类型
    access_token: '',//全局的accesstoken
    islogin: false,//是否登录
  }
})