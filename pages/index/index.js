// pages/index/index.js
import {replaceUrl,getOpenid,getAuthorization,isLogin} from '../../utils/index.js'
import {getBannerList,wxLogin,isBindPhone,getListProductByUser} from '../../api/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[], //轮播图
    code:"",
    user:{},
    isAuth:isLogin(), //是否授权
    deviceList:[] //常用设备列表
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
    var _this = this
    // 查询首页轮播图片
    getBannerList({bannerType:1}).then(res=>{
        if(!res) return false;
        let result = res.map(item=>{
          item.bannerUrl = replaceUrl(item.bannerUrl)
          return item
        })
        _this.setData({
            bannerList:result
        })
    })
   
    // 已经登录
    if(_this.data.isAuth){
      // 校验是否绑定过手机号
      wx.getStorage({
        key:'openid',
        success(res){
          _this.checkBindPhone(res.data)
        },
        fail(err){
          console.log(err)
        }
      })
    }
        
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
  /**
   * 添加设备
   */
  addDevice:function(){
    wx.navigateTo({
      url:"/pages/deviceList/index"
    })
  },
  /**
   *  用户授权
   * */
  bindGetUserInfo:function(e){
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      this.login()
      this.setData({
        user:e.detail.userInfo,
       // isAuth:true
      })
      wx.setStorage({
        data: e.detail.userInfo,
        key: 'user',
      })
    } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
    }
  },
  // 登录
  login() {
    var _this = this
    wx.login({
      success: (res) => {
        const {code=""} = res;
        //return false;
        wxLogin({code}).then(data=>{
          if(!data) return false;
          const {openid,session_key} = data;
          // 存储openid sessin
          wx.setStorage({
            key:"openid",
            data:openid
          })
          wx.setStorage({
            key:"session_key",
            data:session_key
          })
          _this.setData({
            isAuth:true
          })
          _this.checkBindPhone(openid);
        })
      }
    })
  },
  //校验是否绑定手机号
 checkBindPhone(openId){
    const _this  = this;
    // 根据openid查询该用户是否绑定了手机号
    isBindPhone({openId}).then(res=>{
      const {flag,phoneNumber,token} =  res;
      // 未绑定手机号跳转到绑定页面
      if(!flag){
        wx.navigateTo({
          url: '/pages/bind/index',
        })
      }else{
        // 缓存手机号和token
        wx.setStorage({
          data: `Bearer ${token}`,
          key: 'token',
        })
        wx.setStorage({
          data: phoneNumber,
          key: 'phoneNumber',
        })
        // 获取常用设备
        setTimeout(function(){
          getListProductByUser().then(data=>{
            let result = data.map(item=>{
              item.productImgUrl =  replaceUrl(item.productImgUrl);
              return item;
            })

            _this.setData({
              deviceList:result
            })
          })
        },1000)
      }
    })
  },
  // 设备详情
  goDeviceDetail(e){
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const imgUrl = ds.imgUrl
    wx.navigateTo({
      url:`/pages/deviceDetail/index?deviceId=${deviceId}&imgUrl=${imgUrl}`
    })
  }

})