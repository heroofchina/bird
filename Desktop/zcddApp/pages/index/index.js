//index.js
import { commonsdk } from '../../utils/util.js';
//获取应用实例
const app = getApp()
var { statusBarHeight } = wx.getSystemInfoSync();
var { top, bottom, height } = wx.getMenuButtonBoundingClientRect();
var navTop = (top) * 2;//胶囊按钮与顶部的距离
var navHeight = (bottom - height + height + top - statusBarHeight) * 2;
Page({
  data: {
    statusBarHeight:20,
    navHeight:0,
    navTop:0,
    networking: true,//为true是有网络
  },
  onShow:function(){
    this.GET_NET_STATE();
  },
  onReady:function(){
    this.setData({
      navHeight,
      navTop,
    })
  },
  reloadnetwork: function () {
    commonsdk.loading('检查中...', 500);
    this.GET_NET_STATE();
  },
  GET_NET_STATE: function () {
    commonsdk.getAppNetWork().then((res) => {
      this.setData({
        networking: true,
      });
    }).catch((e) => {
      
      this.setData({
        networking: false,
      });
      setTimeout(()=>{
        commonsdk.toast('您当前网络不可用,请您链接wifi,或者断开重连', 1600);
      },800);
    });
  },
})
