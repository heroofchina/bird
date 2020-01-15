
var app = getApp()
Page({
  data:{
    list: [
      { alphabet: 'A', datas: []},
      { alphabet: 'B', datas: []},
      { alphabet: 'C', datas: []},
      { alphabet: 'D', datas: []},
      { alphabet: 'E', datas: []},
      { alphabet: 'F', datas: []},
      { alphabet: 'G', datas: []},
      { alphabet: 'H', datas: []},
      { alphabet: 'I', datas: []},
      { alphabet: 'J', datas: []},
      { alphabet: 'K', datas: []},
      { alphabet: 'L', datas: []},
      { alphabet: 'M', datas: []},
      { alphabet: 'N', datas: []},
      { alphabet: 'O', datas: []},
      { alphabet: 'P', datas: []},
      { alphabet: 'Q', datas: []},
      { alphabet: 'R', datas: []},
      { alphabet: 'S', datas: []},
      { alphabet: 'T', datas: []},
      { alphabet: 'U', datas: []},
      { alphabet: 'V', datas: []},
      { alphabet: 'W', datas: []},
      { alphabet: 'X', datas: []},
      { alphabet: 'Y', datas: []},
      { alphabet: 'Z', datas: []},
    ],
    cateId:{},
    cityId:{}
  },
  onLoad(options){
    console.log(options)
    this.setData({
      cateId: options.cateId,
      cityId: options.cityId
    })
    this._cateList()
  },
  _cateList: function (e) {
    var that = this
    var cateId = that.data.cateId
    var list = that.data.list
    wx.request({
      url: app.apiUrl + '/vcate/listInfo',
      method: 'GET',
      data: { cateId: cateId},
      success: function (e) {
        var data = e.data.data
        for (i = 0; i < list.length; i++){
          for (j = 0; j < data.length; j++){
            if (list[i].alphabet == data[j].initials) {
              list[i].datas.push(data[j])
            }
          }
        }
        that.setData({
          list: list
        })
      }
    })
  },
  
})