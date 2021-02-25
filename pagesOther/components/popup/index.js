// pagesOther/components/popup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     visible:{
       type:Boolean,
       value:false
     },
     imgUrl:{
      type:String,
      value:""
     },
     close:{
       type:Function,
       value:()=>{}
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
    close:function(){
      // let item = {result:false}//要传给父组件的参数
      // this.triggerEvent('close',item)//通过triggerEvent将参数传给父组件
      this.triggerEvent('close');
    },
  
  }
})
