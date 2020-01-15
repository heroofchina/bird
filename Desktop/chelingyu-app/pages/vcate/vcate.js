// pages/vcate/vcate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 1,
        name: '主营业务',
        check: false
      },
      {
        id: 2,
        name: '主营业务',
        check: false
      },
      {
        id: 3,
        name: '主营业务',
        check: false
      },
      {
        id: 4,
        name: '主营业务',
        check: false
      },
      {
        id: 5,
        name: '主营业务',
        check: false
      },
      {
        id: 6,
        name: '主营业务',
        check: false
      },
      {
        id: 7,
        name: '主营业务',
        check: false
      },
      {
        id: 8,
        name: '主营业务',
        check: false
      },
      {
        id: 9,
        name: '主营业务',
        check: false
      },
      {
        id: 10,
        name: '主营业务',
        check: false
      },
    ],
  },

  onLoad: function () {

  },

  chooseLetter(e) {
    this.setData({
      curLetter: null
    });
    var letter = e.currentTarget.dataset.letter;
    console.log(letter);

    // 查找对应的id
    var id = "#letter" + letter;
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: res[0].top + res[1].scrollTop,
        duration: 300
      })
    })
  },
})