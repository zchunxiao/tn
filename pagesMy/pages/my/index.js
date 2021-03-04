// pages/my/index.js
import {getListProductByUser,handleBindPDevice} from '../../../api/index.js'
import {replaceUrl} from '../../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    deviceSize:0,
    deviceList:[],
    list:[
      {
        imgUrl:"../../images/icon1.png",
        text:"个人信息",
        url:"/pagesMy/pages/person/index"
      },
      {
        imgUrl:"../../images/icon2.png",
        text:"说明书",
        url:"/pagesMy/pages/article/index?articleId=111"
      },
      {
        imgUrl:"../../images/icon3.png",
        text:"意见反馈",
        url:"/pagesMy/pages/opinion/index"
      },
      // {
      //   imgUrl:"../../images/icon4.png",
      //   text:"基本设置",
      //   url:"/pagesMy/pages/setting/index"
      // },
      {
        imgUrl:"../../images/icon5.png",
        text:"联系我们",
        url:"/pagesMy/pages/contact/index"
      }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var _this  = this;
    wx.getStorage({
      key: 'user',
      success:res=>{
        const {data,errMsg} = res;
        if(errMsg ==  "getStorage:ok"){
          _this.setData({
            user:data
          })
        }
      },
      fail:res=>{
        console.log("获取失败",res)
      }
    })
    getListProductByUser().then(data=>{
      let result = (data||[]).map(item=>{
        item.productImgUrl =   replaceUrl(item.productImgUrl);
        return item;
      })
      _this.setData({
        deviceSize:data ? data.length:0,
        deviceList:result
      })
    })
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

  },
  // 是否删除设备弹窗
  deleteDevice:function(e){
    const _this  = this;
    wx.showModal({
      title: '删除设备',
      content: '你确定要删除此设备吗？',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
       
          const ds = e.currentTarget.dataset;
          const {blueToothName,snCode} =  ds;
          _this.handleDeleteDevice(blueToothName,snCode);
        }
      }
    })
  },
  // 编辑个人信息
  edit:function(){
    wx.navigateTo({
      url: '/pagesMy/pages/person/index',
    })
  },
  // 帮助
  goHelp:function(){
    wx.navigateTo({
      url: '/pagesMy/pages/help/index',
    })
  },
  // 删除设备
  handleDeleteDevice:function(blueToothName,snCode){
      const params = {
        bindType:2, //绑定类型(1:绑定 2:解绑)
        blueToothName,
        snCode
      }
      console.log("pahdram?:",params)
      handleBindPDevice(params).then(data=>{
        console.log("绑定蓝牙设备:",data)
        if(data && data == '操作成功'){
          wx.showToast({
            title:'删除成功',
            duration:2000
          })
          setTimeout(() => {
            wx.switchTab({
              url:"/pages/index/index"
            })
          }, 2000);
        }
      })

  },
  goUrl:function(e){
   const {url} = e.currentTarget.dataset;
   url && wx.navigateTo({
    url
  })
  }
})