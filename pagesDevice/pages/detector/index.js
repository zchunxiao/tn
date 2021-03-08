// pagesDevice/pages/Detector/index.js
import {getConfigParams} from "../../../api/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chargeCommand:"",
    chargeTime:"",
    dischargeCommand:"",
    dischargeTime:"",
    freezeCommand:"",
    freezeTime:"",
    intervalTime:""
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
    const _this = this;
    getConfigParams().then(data=>{
      console.log("获取配置参数:",data)
      const {
        chargeCommand,
        chargeTime,
        dischargeCommand,
        dischargeTime,
        freezeCommand,
        freezeTime,
        intervalTime
      } = data;
      _this.setData({
        chargeCommand,
        chargeTime,
        dischargeCommand,
        dischargeTime,
        freezeCommand,
        freezeTime,
        intervalTime
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
  // 查看详情
  goMore:function () {
    wx.navigateTo({
      url:`/pagesDevice/pages/report/index`
    })
  },
  // 检测仪检测
  goCheck:function(e){
    const {type} =  e.currentTarget.dataset;
    console.log("www:",type);
  }
})