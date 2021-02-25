// pages/person/index.js
import {getStorageByKey} from '../../../utils/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    isShow:false,
    imgUrl:getStorageByKey('qrCodeUrl')|| ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
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
  showCode:function(){
    const _this  = this;
    _this.setData({
      isShow:true
    })
  },
  getCloseInfo(e){
    const _this  = this;
    _this.setData({
      isShow:false
    })
  }
})