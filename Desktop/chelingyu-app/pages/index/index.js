//index.js
//获取应用实例
const app = getApp()
var timeUtil = require('../../utils/util.js');
Page({
  data: {
    time: 'create',
    timer: null,
    isTrue: true,
    anmationShow: false,
    banner:[],
    isTrue:false,
    isShow:false,
    customer: [],
    allcustomer: [],
    searchBar: {
      focus: false,
      value: null,
      searchBarClasses: 'weui-search-bar'
    },
  },
  /**
     * 点击
     */
  onClickSearchBar() {
    let newSearchBar = {
      focus: true,
      searchBarClasses: 'weui-search-bar weui-search-bar_focusing'
    };
    this.setData({
      searchBar: Object.assign(this.data.searchBar, newSearchBar)
    });
  },
  /**
   * 取消
   */
  onCancelSearchBar() {
    let newSearchBar = {
      value: null,
      focus: false,
      searchBarClasses: 'weui-search-bar'
    };
    this.setData({
      searchBar: Object.assign(this.data.searchBar, newSearchBar),
      customer: JSON.parse(JSON.stringify(this.data.allcustomer))
    });
    this.resetHeanderCount()
  },

  /**
   * 点击清除图标
   */
  onClearSearchBar() {
    let newSearchBar = {
      value: null
    };
    this.setData({
      searchBar: Object.assign(this.data.searchBar, newSearchBar),
      customer: JSON.parse(JSON.stringify(this.data.allcustomer))
    });
    this.resetHeanderCount()
  },

  /**
   * 输入框输入时
   */
  searchBarInput(event) {
    let newSearchBar = {
      value: event.detail.value
    };
    // 过滤数据
    const filterData = value => {
      const filterList = []
      this.data.allcustomer.forEach(item => {
        item.customerVo.name.indexOf(value) >= 0 || item.customerVo.plate.indexOf(value) >= 0 ? filterList.push(item) : null
      })
      return filterList
    }
    this.setData({
      searchBar: Object.assign(this.data.searchBar, newSearchBar),
      customer: filterData(newSearchBar.value)
    });
    this.resetHeanderCount()
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo){
      this.setData({
        userInfo: wx.getStorageSync('userInfo') //用户详情
      })
      this._customer()
      this._count()
      this.getCityInfo()
    } else {
      this.info();
    }
    this._banner();
  },
  onShow: function(){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo') //用户详情
      })
      this._customer()
      this._count()
    } else {
      this.info();
    }
  },
  /**
   * 用户详情
   */
  getCityInfo() {
    var that = this
    var cityId = that.data.userInfo.serviceUserVo.cityId || 0
    wx.request({
      url: app.apiUrl + '/city/getInfo',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        id: cityId,
      },
      success: function (e) {
        const data = e.data.data || {}
        wx.setStorageSync("cityData", data)
      }
    })
  },
  _banner: function (e) {
    var that = this
    var banner = that.data.banner
    wx.request({
      url: app.apiUrl + '/banner/list',
      method: 'GET',
      success: function (e) {
        for (i = 0; i < e.data.data.length; i++) {
          if (e.data.data[i].position == 0 && e.data.data[i].status == "1") {
            banner.push(e.data.data[i])
            that.setData({
              isTrue: true
            })
          }
        }
        that.setData({
          banner: banner
        })
      }
    })
  },
  info : function(){
    var that = this
    var id = wx.getStorageSync('id')
    wx.request({
      url: app.apiUrl + '/serviceUser/info',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        id: id
      },
      success: function (e) {
        wx.clearStorageSync()
        wx.setStorageSync("userInfo", e.data.data)
        that._customer();
        that._count()
      }
    })
  },
  _selection: function(e) {
    var that = this
    var time = e.target.dataset.time
    that.setData({
      time: time
    })
    that._customer()
  },

  _read: function(e) {
    var that = this
    that.setData({
      isTrue: false
    })
  },
  _phone: function(e) {
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
  _customer: function(e) {
    var that = this
    var time = that.data.time
    var userInfo = that.data.userInfo
    wx.showNavigationBarLoading()
    wx.request({
      url: app.apiUrl + '/customer/list',
      method: 'GET',
      data: {
        serviceId: userInfo.serviceUserVo.id,
        time: time
      },
      success: function(e) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        const data = e.data.data || []
        var customer = data
        for (i = 0; i < customer.length; i++) {
          customer[i].customerVo.createTime = timeUtil.formatTimeTwo(customer[i].customerVo.createTime, 'Y/M/D');
          customer[i].customerVo.remindTime = timeUtil.formatTimeTwo(customer[i].customerVo.remindTime, 'Y/M/D');
          customer[i].customerVo.startTime = timeUtil.formatTimeTwo(customer[i].customerVo.startTime, 'Y/M/D');
          customer[i].customerVo.updateTime = timeUtil.formatTimeTwo(customer[i].customerVo.updateTime, 'Y/M/D');
          customer[i].customerVo.time = timeUtil.formatTimeTwo(customer[i].customerVo.time, 'Y/M/D');
        }
        that.setData({
          count: data.count,
          customer,
          allcustomer: customer
        })
        that.resetHeanderCount()
      }
    })
  },
  resetHeanderCount() {
    var that = this
    const timer = setTimeout(() => {
      (that.data.customer && that.data.customer.length > 0) ? wx.setNavigationBarTitle({
        title: '客户列表(' + that.data.customer.length + ')'
      }) : wx.setNavigationBarTitle({
        title: '客户列表'
      })
      clearTimeout(timer)
    }, 0)
    
  },
  // 下拉刷新
  onPullDownRefresh() {
    this._customer();
  },
  _count: function() {
    var that = this
    var userInfo = that.data.userInfo
    wx.request({
      url: app.apiUrl + '/feedback/count',
      method: 'GET',
      data: {
        salerId: userInfo.serviceUserVo.id,
      },
      success: function(e) {
        that.setData({
          num: e.data.data
        })
      }
    })
  },
  hide: function () {
    this.setData({
      isTrue: false
    })
  },
  detail(e) {
    const that = this
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/info/info?remindTime=' + item.customerVo.remindTime+ '&plate=' + item.customerVo.plate + '&id=' + that.data.userInfo.serviceUserVo.id
    })
  },
  //按住按钮
  startHandel: function() {
    const timer = setTimeout(() => {
      wx.showToast({
        image: '/img/microphone.png',
        duration: 1000 * 60 * 60,
        title: '接收中'
      })
      clearTimeout(timer)
    }, 500)
    this.setData({
      anmationShow: true,
      isShow: true,
      timer: timer
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
    this.data.timer ? clearTimeout(this.data.timer) : null
    wx.hideToast()
    this.setData({
      anmationShow: false,
      isShow: false
    })
    const recorderManager = wx.getRecorderManager()
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
          console.log('=====', res)
          var json = JSON.parse(res.data).result
          var r = JSON.stringify(json)
          var result =  r.slice(2, r.length-3)
          console.log(result)
          wx.navigateTo({
            url: '../search/search?word=' + result + '&cityId=' + that.data.userInfo.serviceUserVo.cityId,
          })
        }
      })
      
    })
    //触发录音停止
    wx.getRecorderManager().stop()
  },

})