const { hexToStr,hexToDecimalism,ab2hex} = require("../../../utils/index.js")
import {getProductById} from "../../../api/index.js"
// pages/deviceDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:"", //设备id
    imgUrl:"" ,// 图片url
    snCode:"",
    serviceId:[],
    deviceInfo:{},
    connectStatus:false,
    visible:false,
    text:"获取中"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {deviceId,imgUrl} = options
    const _this  = this;
    this.setData({
      deviceId,
      imgUrl
    })
    getProductById({deviceId}).then(data=>{
      const {snCode} = data;
      _this.setData({
        snCode,
      })
    })
  
    // 初始化蓝牙
    this.initBlue();
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
    wx.showLoading({
      title:"连接中"
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
  // 帮助
  goHelp:function(){
    wx.navigateTo({
      url: '/pagesMy/pages/help/index',
    })
  },
  // 快速检测
  goFastTest:function(){
    wx.navigateTo({
      url: '/pagesMy/pages/fastTest/index',
    })
  },
  // 初始化蓝牙设备
  initBlue:function(){
 
    
    var that = this;
    wx.openBluetoothAdapter({//调用微信小程序api 打开蓝牙适配器接口
      success: function (res) {
        that.findBlue();
        that.setData({
          visible:true
        })
      },
      fail: function (res) {//如果手机上的蓝牙没有打开，可以提醒用户
        wx.showToast({
          title: '请开启蓝牙',
          icon: 'fails',
          duration: 1000
        })
      }
    })
  },
  //开始搜索蓝牙设备
  findBlue:function(){
    var _this = this;
     // 获取本机蓝牙适配器的状态
     wx.getBluetoothAdapterState({
      success: function (res) {
        if(!res.available) return false;
        _this.getBlue()
      },
      fail: function (res) {
        wx.showToast({
          title: '蓝牙不可用',
        })
       _this.stopBluetoothDevicesDiscovery();
      }

    })
  },
  // 获取搜索到的设备信息
  getBlue(){
    let id,i=0,_this = this;

    wx.getStorage({
       key: 'deviceId',
       success:res=>{
         id = res.data
       }
     });

    // 搜索蓝牙设备（消耗大量资源，要及时结束）
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        // 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
        setTimeout(() => {
          wx.getBluetoothDevices({
            success:(res)=>{
             _this.connetBlue(id)
              wx.stopBluetoothDevicesDiscovery({
                success (res) {
                },
                fail (res) {
                  console.log(res,"关闭搜索失败")
                }
              });
            }
          })
        }, 1000);
       
      }        
    })
  },
  // 获取到设备之后连接蓝牙设备
  connetBlue(deviceId){ 
    const _this = this;
    wx.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      success (res) {
        console.log("蓝牙连接成功:",res)
    
           // 获取特定设备的所有服务
        wx.getBLEDeviceServices({
            deviceId:deviceId,
            success: function(res) {

                const serviceId = res.services.map(item=>{
                    return item.uuid
                })

                // 针对一个特定服务查看这个服务所支持的操作
                wx.getBLEDeviceCharacteristics({
                    deviceId: deviceId,
                    serviceId: serviceId[1],
                    success: function (res) {
                      // console.log("dddhjfghjdsfghjd:",res)
           
                     let characteristicId=res.characteristics.map(item=>{
                       return item.uuid
                     })
                     // 开启notify并读取蓝牙发过来的数据，开启这个后我们就能实时获取蓝牙发过来的值了
                     wx.notifyBLECharacteristicValueChange({
                        state: true,
                        deviceId: deviceId,
                        serviceId: serviceId[1],
                        characteristicId: characteristicId[0],
                        success: function (res) {
                            console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                        }
                      })
                      
                      let str="";
                      wx.onBLECharacteristicValueChange(function (res) {
      
                        if(str.length<242){
                          str+=ab2hex(res.value)
                          return false;
                        }else{
                          str=ab2hex(res.value)
                        }
                        
                        // 获取设备信息
                      _this.getDeviceInfo(str)
                    //  wx.hideLoading();
                      wx.closeBLEConnection();
                      wx.closeBluetoothAdapter()
                        
                      })
                    }
                })
        
            },
            fail:function(err){
              console.log("res.services;err",err)
            }
          })
      },
      fail (err){
        console.log("errr:",err);
      }
    })
  },
  // 获取设备信息
  getDeviceInfo(str){
       console.log("djhhfhhgfd999:",str.substr(240,2));
       const _this = this;
       // 电池状态
       let  BatterySatusText = hexToDecimalism(str.substr(10,2));
       // 电池温度
       let  BatteryTempText =((+hexToDecimalism(str.substr(12,4)))-2731)/10;
       // mos温度
       let  mosTempText =((+hexToDecimalism(str.substr(16,4)))-2731)/10;
       
       // 充电器匹配检测电压
       let Voltage1Text =  hexToDecimalism(str.substr(20,4));
       // 放电电流
       let dischargeText = hexToDecimalism(str.substr(24,4));
       // 充电电流
       let discharge1Text = hexToDecimalism(str.substr(28,4));
       // 单体电压
       let  Voltage2Text = str.substr(32,80);
       // 充电截至电压
       let  Voltage3Text = hexToDecimalism(str.substr(112,4));
       // 电池总压
       let  Voltage4Text = hexToDecimalism(str.substr(116,8));
       // 固件版本
       let  version1Text = hexToDecimalism(str.substr(31,4));
       // 硬件版本
       let  version2Text = hexToDecimalism(str.substr(124,4));
       // 电池规格
       let typeText =  hexToDecimalism(str.substr(132,4));
       // 蓝牙Mac地址
       let mac  =  str.substr(136,12);
       // sn码
       let sncodeText = hexToStr(str.substr(148,64));

       console.log("sn码",sncodeText);
       console.log("电池状态",BatterySatusText);
       console.log("电池温度",BatteryTempText);
       console.log("mos温度", mosTempText);
       console.log("充电器匹配检测电压",Voltage1Text);
       console.log("放电电流:",dischargeText);
       console.log("充电电流:",discharge1Text);
       console.log("单体电压",Voltage2Text);
       console.log('充电截至电压:',Voltage3Text)
       console.log('电池总压:',Voltage4Text)
       console.log('固件版本:',version1Text)
       console.log('硬件版本:',version2Text)
       console.log('电池规则:',typeText)
       console.log('mac地址:',mac)
       
      _this.setData({
        connectStatus:true,
        deviceInfo:{
          sncodeText,
          BatterySatusText,
          BatteryTempText,
          mosTempText,
          Voltage1Text,
          dischargeText,
          discharge1Text,
          Voltage2Text,
          Voltage3Text,
          Voltage4Text,
          version1Text,
          version2Text,
          typeText,
          mac
        }
      })
      // setTimeout(() => {
      //   wx.hideLoading();
      // }, 2000);
      _this.setData({
        visible:false
      })
  }
})