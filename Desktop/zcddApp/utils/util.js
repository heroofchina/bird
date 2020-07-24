import DOMAIN from './domain.js';
//全部工具类
class CommonSDK {
  constructor() {
    
  }
  get_app_id() {
    return 'wxce9262a8597801af'
  }
  //将对象数据转换成form格式
  transferForm(obj) {
    let str = ''
    for (let i in obj) {
      str += `&${i}=${obj[i]}`
    }
    str = str.substring(1)
    return str ? `?${str}` : ''
  }
  loading(msg) {
    wx.showLoading({
      title: msg,
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 600);
  }
  modal(title, content) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        cancelColor: '#6A707E',
        confirmColor: '#0A7E2A',
        title: title,
        content: content,
        success: (e) => {
          if (e.confirm) {
            resolve();
          } else {
            reject();
          }
        }
      })
    });
  }

  request_loading(msg) {
    //wx.showNavigationBarLoading();
    wx.showLoading({
      title: msg,
    })
  }
  request_hide_loading() {
    //wx.hideNavigationBarLoading();
    wx.hideLoading();
  }
  //封装公共的toast
  failedtoast(msg, time) {
    let s = 1400;
    if (time) {
      s = time;
    }
    wx.showToast({
      title: msg + '〜',
      icon: 'none',
      duration: s,
    })
  }
  //封装公共的toast
  successtoast(msg, time) {
    let s = 1800;
    if (time) {
      s = time;
    }
    wx.showToast({
      title: msg + '〜',
      icon: 'success',
      duration: s,
    })
  }
  toast(msg, time) {
    if (!time) {
      time = 1200;
    }
    wx.showToast({
      icon: 'none',
      title: msg + '〜',
      duration: time
    })
  }
  //将数组进行转换
  transferArray(arr) {
    var newarr = [];
    for (var i = 0; i < arr.length; i++) {
      newarr.push(arr[i].text);
    }
    return newarr;
  }
  get_user_login(params, callback) {
    var get_refresh_token_url = '/api/wechat/login';
    this.postAjax(get_refresh_token_url, params).then((resp) => {
      this.userLoginHandler(resp, callback);
    })
  }




  /**
   * 重新token获取接口**/
  rerequest(requestinfo, resolve, reject) {
    let app = getApp();
    var get_refresh_token_url = '/api/wechat/login';
    wx.login({
      success: (res) => {
        const { code } = res;
        this.postAjax(get_refresh_token_url, { code: code, appid: commonsdk.get_app_id() }).then((resp) => {
          const { access_token, token_type, curStatus } = resp.data;

          console.log(' { access_token, token_type, curStatus }', { access_token, token_type, curStatus });
          app.globalData.token_type = token_type;
          app.globalData.access_token = access_token;
          app.globalData.isbind = curStatus;
          wx.setStorageSync('access_token', access_token);
          wx.setStorageSync('access_type', token_type);
          if (requestinfo.method === 'GET') {
            this.getAjax(requestinfo.url, requestinfo.params).then((response) => {
              console.log('获取过期以后GET的接口信息', response);

              if (response.code === 0) {
                console.log(response.code, response.data);
                resolve(response)
              } else {
                reject(response);
              }
            })
          } else if (requestinfo.method === 'POST') {
            this.postAjax(requestinfo.url, requestinfo.params).then((response) => {
              console.log('获取过期以后POST的接口信息', response);
              if (response.code === 0) {
                console.log(response.code, response.data);
                resolve(response)
              } else {
                reject(response);
              }
            })
          } else {
            this.putAjax(requestinfo.url, requestinfo.params).then((response) => {
              console.log('获取过期以后POST的接口信息', response);
              if (response.code === 0) {
                resolve(response)
              } else {
                reject(response);
              }
            })
          }

        })
      }
    })
  }
  request_success_handle(resolve, reject, requestinfo, res) {
    //wx.hideNavigationBarLoading();
    if (res) {
      let { code } = res.data;
      //code = 1040
      if (code === 0) {
        resolve(res.data);
      } else if (code === 1043) {//返回错误提示信息
        //this.getRefreshToken(requestinfo);
        this.rerequest(requestinfo, resolve, reject);
        return false;
      } else if (code === 1) {
        this.failedtoast(res.data.msg || '请求有误', 2500);
        reject(res.data);
        return false;
      } else if (code === 1143) {
        reject(res.data);
      } else if (code === 1040) {
        this.comfirm_bind(() => {
          wx.navigateTo({
            url: '../../pages/common-page/signup/signup',
          })
        });
        reject(res.data);
      } else if (code === 1041) {
        this.rerequest(requestinfo, resolve, reject);
        return false;
      } else {
        this.failedtoast(res.data.msg || '请求有误', 2500);
        reject(res.data);
      }
    } else {
      this.failedtoast(res.data.msg || '请求有误', 2500);
      reject(res.data);
      return false;
    }
  }

  request_error_handle(reject, e) {
    this.failedtoast('请求有误', 2500);
    reject('网络出错');
  }
  /**
   * 基础的请求 get API**/
  getAjax(request_url, params) {
    //wx.showNavigationBarLoading()
    console.log('当前请求token是::: ', this.get_access_token());
    var requrl = DOMAIN + request_url;
    var formdata = this.transferForm(params);
    let requestinfo = {
      url: request_url,
      params: params,
      method: 'GET',
    };//请求对象拼装
    return new Promise((resolve, reject) => {
      wx.request({
        url: requrl + formdata,
        method: 'GET',
        header: {
          'Authorization': this.get_access_token(),
          'CENTURYKOUNRE-WX-APPID': this.get_app_id(),
        },
        success: (res) => {//服务器返回数据
          this.request_success_handle(resolve, reject, requestinfo, res);
        },
        error: function (e) {
          this.request_error_handle(reject, e);
        }
      })
    })
  }
  //获取每次请求的token
  get_access_token() {
    let app = getApp();
    var access_token = wx.getStorageSync('access_token') || app.globalData.access_token;
    var token_type = wx.getStorageSync('token_type') || app.globalData.token_type;
    if (token_type === '' || !token_type) {
      token_type = ''
    }
    if (access_token === '' || !access_token) {
      access_token = '';
    }
    return token_type + ' ' + access_token;
  }
  userLoginHandler(resp, callback) {
    //console.log('get login back data::::', JSON.stringify(resp));
    if (!resp.data) {
      this.toast('请求错误');
      return false;
    }
    let app = getApp();

    var { access_token, token_type } = resp.data;
    //console.log('access_token, curStatus, token_type', access_token, token_type);
    //将信息进行全局保存
    app.globalData.access_token = access_token;
    app.globalData.token_type = token_type;
    app.globalData.islogin = true;
    app.globalData.is_show_user_role = false;
    //存储到本地
    wx.setStorageSync('access_token', access_token);
    wx.setStorageSync('token_type', token_type);
    callback();
  }
  /**
   * 基础的请求 post API**/
  postAjax(request_url, params) {
    //wx.showNavigationBarLoading()
    console.log('当前请求token是::: ', this.get_access_token());
    let headers = {
      'content-type': 'application/json',
      'Authorization': this.get_access_token(),
      'CENTURYKOUNRE-WX-APPID': this.get_app_id(),
    };
    if (request_url === '/api/wechat/login') {
      headers['Authorization'] = '';
    }
    var requrl = DOMAIN + request_url;
    let requestinfo = {
      url: request_url,
      params: params,
      method: 'POST',
    };//请求对象拼装
    return new Promise((resolve, reject) => {
      wx.request({
        url: requrl,
        method: 'POST',
        header: headers,
        data: params,
        success: (res) => {//服务器返回数据
          //console.log('get login resp:::', res);
          this.request_success_handle(resolve, reject, requestinfo, res);
        },
        error: function (e) {
          this.request_error_handle(reject, e);
        }
      })
    })

  }

  putAjax(request_url, params) {
    //wx.showNavigationBarLoading()
    var requrl = DOMAIN + request_url;
    let requestinfo = {
      url: request_url,
      params: params,
      method: 'PUT',
    };//请求对象拼装
    return new Promise((resolve, reject) => {
      wx.request({
        url: requrl,
        method: 'PUT',
        header: {
          'content-type': 'application/json',
          'Authorization': this.get_access_token(),
          'CENTURYKOUNRE-WX-APPID': this.get_app_id(),
        },
        data: params,
        success: (res) => {//服务器返回数据
          this.request_success_handle(resolve, reject, requestinfo, res);
        },
        error: function (e) {
          this.request_error_handle(reject, e);
        }
      })
    })
  }
  /**
   * 判断用户是否登录过
   * **/
  userLogin() {
    //保存用户点击授权成功以后的本地标识
    var user_aggrement_auth = wx.getStorageSync('user_aggrement_auth');
    if (!user_aggrement_auth) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 获取基本的网络信息
   * NetWorkNo:
   * 0,1 为 unknown 和 none
   * 2,3,4 对应2,3,4g
   * 5对应wifi
   * **/
  getBaseNetWork() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success: function (res) {
          var networkType = res.networkType
          switch (networkType) {
            case "unknown":
              reject({ NetWorkNo: 0 });
              break;
            case "none":
              reject({ NetWorkNo: 1 });
              break;
            case "2g":
              resolve({ NetWorkNo: 2 });
              break;
            case "3g":
              resolve({ NetWorkNo: 3 });
              break;
            case "4g":
              resolve({ NetWorkNo: 4 });
              break;
            case "wifi":
              resolve({ NetWorkNo: 5 });
              break;
          }
        },
        fail: function () {
          reject({ NetWorkNo: 0 });
        }
      })
    });
  }





  /**
   * 对基础网络信息进行处理和不可用网络和可用网络
   * .then返回 可用
   * .catch返回一律不可用
   */
  getAppNetWork() {
    return new Promise((resolve, reject) => {
      this.getBaseNetWork().then((state) => {
        //console.log('getAppNetWork',state);
        const { NetWorkNo } = state;
        if (NetWorkNo === 2 || NetWorkNo === 3) {
          this.toast('当前网络较慢，建议您切换到4G或者WIFI', 1800);
          resolve(state);
          return false;
        } else {
          resolve(state);
        }
      }).catch((estate) => {
        //console.log('获取到错误网络信息',estate);
        reject(estate);
      });
    })

  }
  updateListByIndex(index, time_list) {
    var size = time_list.length;
    for (var i = 0; i < size; i++) {
      if (index === i) {
        time_list[i].checked = true;
      } else {
        time_list[i].checked = false;
      }
    }
    return time_list;
  }

  resetList(list) {
    var size = list.length;
    for (var i = 0; i < size; i++) {
      list[i].checked = false;
    }
    return list;
  }

  comfirm_bind(callback) {
    wx.showModal({
      cancelColor: '#6A707E',
      confirmColor: '#0A7E2A',
      title: '未实名认证提示',
      content: '政策多多小程序会关联您的健康安全数据等，您当前还未绑定手机号和验证身份，请您绑定手机号和身份信息～',
      success: (e) => {
        if (e.confirm) {
          console.log('发送接口请求并修改状态');
          if (callback) {
            callback();
          }
        } else {
        }
      },
      fail: function () {

      }
    })
  }

  isNumber(s) {
    if (Number.isNaN(parseInt(s))) {
      return false;
    } else {
      return true;
    }
  }

  

  validate_identify(str) {
    const regIdentify = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (regIdentify.test(str)) {
      return true;
    } else {
      return false;
    }
  }

  validate_phone(str) {
    const regPhone = /^1[3|4|5|7|8|6|9][0-9]{9}$/;
    if (regPhone.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  
packager_controller(callback) {
    console.log('callback.isclick', callback.isclick);
    if (callback.isclick) {
      setTimeout(() => {
        callback.isclick = false;
      }, 600);
    } else {
      callback.isclick = true;
      callback();
      setTimeout(() => {
        callback.isclick = false;
      }, 600);
    }
  }

  get_stand_time() {
    var d = new Date();
    let year = d.getFullYear();
    let month = (d.getMonth() + 1);
    var day = d.getDate();
    return year + '-' + month + '-' + day
  }
  fillter_friends(content) {
    var cxt = [];
    for (var i = 0; i < content.length; i++) {
      if (content[i].name) {
        cxt.push(content[i])
      }
    }
    return cxt;
  }
  get_friends_list(that) {
    commonsdk.getAjax('/api/user/relative', {}).then((res) => {
      console.log('get rel list:::', res);
      const { code } = res; let { content } = res.data;
      wx.hideLoading();
      content = commonsdk.fillter_friends(content);
      if (code === 0 && content) {
        const size = content.length;
        if (size !== 0) {
          const { friendsLimit } = that.data;
          const reduce = friendsLimit - size;
          that.setData({
            friendList: content,
            friendsList: content,
            friendsSize: size,
            friendsReduce: reduce,
            emptyFriends: false,
          });
        } else {
          that.setData({
            emptyFriends: true,
          });
        }

      } else {
        commonsdk.toast(res.msg, 2000);
      }
    })
  }
  getpages() {
    let pages = getCurrentPages();
    let size = pages.length;
    return pages[size - 2];
  }
  user_register(pageIns) {
    commonsdk.get_account_info((res) => {
      if (res.curStatus === 1) {
        pageIns.setData({
          isRegister: false,
        });
      } else {
        pageIns.setData({
          isRegister: true,
        });
      }
    });
  }
  getService(url, params, success) {
    commonsdk.getAjax(url, params).then((res) => {
      const { code } = res;
      if (code === 0) {
        success ? success(res) : ''
      } else {
        commonsdk.toast(res.msg, 2000);
      }
    });
  }
  postService(url, params, success) {
    commonsdk.postAjax(url, params).then((res) => {
      const { code } = res;
      if (code === 0) {
        success ? success(res) : ''
      } else {
        commonsdk.toast(res.msg, 2000);
      }
    });
  }
}
const commonsdk = new CommonSDK();
module.exports = {
  commonsdk: commonsdk
}
