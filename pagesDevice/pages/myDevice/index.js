// device/pages/device/index.js
import {getListProductByUser,handleBindPDevice} from '../../../api/index.js'
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
  // 删除设备
  handleDeleteDevice:function(blueToothName,snCode){
      const params = {
        bindType:2, //绑定类型(1:绑定 2:解绑)
        blueToothName,
        snCode
      }
      const _this  = this;
      handleBindPDevice(params).then(data=>{
        _this.setData({
          visible:false
        })
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
})