// device/pages/device/index.js
import {getListProductByUser} from '../../../api/index.js'
import {replaceUrl} from '../../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList:[]
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
    const _this  = this;
    getListProductByUser().then(data=>{
      let result = data.map(item=>{
        item.productImgUrl =  replaceUrl(item.productImgUrl);
        return item;
      })

      _this.setData({
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
  // 电池详情
  goDetail:function(e){
    const {deviceId, imgUrl } =  e.currentTarget.dataset
    wx.navigateTo({
      url:`/pagesDevice/pages/deviceDetail/index?deviceId=${deviceId}&imgUrl=${imgUrl}`
    })
  },
  // 检测仪
  goDetector:function(){
    wx.navigateTo({
      url:`/pagesDevice/pages/detector/index`
    })
  }
})