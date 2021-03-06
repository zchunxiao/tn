// pagesMy/pages/concat/index.js
import {getContactUs} from "../../../api/index"
import {replaceUrl} from "../../../utils/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
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
    getContactUs().then(data=>{
     
      const {records} = data;
     
      let result = records.map((item)=>{
        item.qrCode = replaceUrl(item.qrCode)
        item.headImgUrl = replaceUrl(item.headImgUrl)
        return item
      })
 
      this.setData({
        info:result.length > 0?result[0]:[]
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  tel:function (e) {
    const {phone} = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  }
})