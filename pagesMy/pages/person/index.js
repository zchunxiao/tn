// pages/person/index.js
import {getStorageByKey} from '../../../utils/index'
import {getUserInfo, editUserInfo} from '../../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    isShow:false,
    imgUrl:getStorageByKey('qrCodeUrl')|| "",
    phoneNumber:getStorageByKey('phoneNumber'),
    realName:"",
    nameEditShow:false,
    userId:""
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
    _this.userInfo()
  },
   userInfo:function(){
     const _this  = this;
    getUserInfo(getStorageByKey('phoneNumber')).then(data=>{
      const {realName,userId} = data;
      _this.setData({
        realName,
        userId,
        nameEditShow :realName?false:true
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
  },
  closeEditName:function(){
    const _this  = this;
    _this.setData({
      nameEditShow:false
    })
  },
  changeName:function(){

    const _this  = this;
    _this.setData({
      nameEditShow:true
    })
  },
  editName:function(data){
    const _this  = this;
   editUserInfo({realName:data.detail,userId:this.data.userId}).then(data=>{
     if(data){
      wx.showToast({
        title:"修成功"
      });
      _this.userInfo();
     }
   })
  }
})