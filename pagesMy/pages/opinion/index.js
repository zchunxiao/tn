// pagesMy/pages/opinion/index.js
import {getFeedBack} from "../../../api/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
     value:""
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
  bindFormSubmit:function(){
    getFeedBack(this.data.value).then(data=>{
      if(!data) return false;
      wx.showToast({
        title:data
      })
      setTimeout(() => {
        // wx.navigateTo({
        //   url:"/pagesMy/pages/person/index"
        // })
        wx.navigateBack()
      }, 2000);
    })
  },
  handleBindinput:function(e){
    const {value}  = e.detail;
    this.setData({
      value
    })
  }
})