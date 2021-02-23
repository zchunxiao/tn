// pages/bind/index.js
import {bindPhone} from '../../api/index.js'
import {getStorageByKey} from '../../utils/index.js'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     openid:"",
     sessionKey:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this= this;
    // getOpenid(function(id){
    //   _this.setData({
    //     openid:id
    //   })
    // })
    // getSessionKey(function(key){
    //   _this.setData({
    //     sessionKey:key
    //   })
    // })

    _this.setData({
      openid:getStorageByKey('openid'),
      sessionKey:getStorageByKey('session_key')
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

  },  // 绑定手机号
  bindGetPhoneNumber:function(e){
    const _this = this;
  
    // 将encryptedData和iv传给后台，后台通过解密算法

    const {detail:{encryptedData,iv}} =  e
    console.log(e.detail.encryptedData);
    console.log(e.detail.iv);
    if(e.detail.errMsg == "getPhoneNumber:ok"){
      bindPhone({
        openId:_this.__data__.openid,
        sessionKey:_this.__data__.sessionKey,
        encryptedData,
        iv
      }).then(res=>{
        if(!res) return false;
        const { phoneNumber,token} = res;
        // app.globalData.phoneNumber = phoneNumber;
        // app.globalData.token = `Bearer ${token}`;
        wx.setStorage({
          data: `Bearer ${token}`,
          key: 'token',
        })
        wx.setStorage({
          data: phoneNumber,
          key: 'phoneNumber',
        })
        wx.switchTab({
          url:"/pages/index/index"
        })
        this.setData({
          isBindPhone:true
        })
      })
  
    }
  }
})