// components/Loading/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     // 这里定义了innerText属性，属性值可以在组件使用时指定
     isLoading: {
      type: Boolean,
      value: true,
    },
    text:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){}
  }
})
