// components/my-layout/my-layout.js
Component({
  /**
   * 组件的属性列表
   */
  options:{
    addGlobalClass: true,
  },
  properties: {
    networking: {
      type: Boolean,
      value: true,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    reloadnet: function () {
      this.triggerEvent('reloadnetwork', {})
    }
  }
})