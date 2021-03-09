const { hexToStr,hexToDecimalism,ab2hex,hex_to_bin} = require("../../../utils/index.js")
import {getProductById} from "../../../api/index.js"
// pages/deviceDetail/index.js
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:"", //设备id
    imgUrl:"" ,// 图片url
    snCode:"",
    TnSnCode:"",
    blueToothName:"",
    serviceId:[],
    deviceInfo:{},
    connectStatus:false,
    visible:false,
    text:"获取中",
    blueStr:"",
    isUseBlueTooth:false // 检测蓝牙是否可用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:"连接中"
    })
    const {deviceId,imgUrl} = options
    const _this  = this;
    this.setData({
      deviceId,
      imgUrl
    })
    getProductById({deviceId}).then(data=>{
      const {snCode,blueToothName} = data;
      _this.setData({
        snCode,
        TnSnCode: snCode.replace(/HG20/g, 'TN'),
        blueToothName
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
    this.data.isUseBlueTooth && wx.closeBluetoothAdapter()
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
          visible:true,
          isUseBlueTooth:true
         
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
         // 搜索蓝牙设备（消耗大量资源，要及时结束）
        wx.startBluetoothDevicesDiscovery({
          services: [],
          success: function (res) {
            console.log("搜索蓝牙设备:",res)
            // 获取蓝牙设备
          // 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
          // 每隔5秒中搜索一次列表
          timer = setInterval(() => {
            wx.getBluetoothDevices({
              success:function(res){
                let tnDeviceList = res.devices.filter(item=>{
                  return item.name.indexOf("TN") > -1
                });

                let list;
                tnDeviceList.map(item=>{
                  if(item.name  == _this.data.TnSnCode){
                    list=item
                  }
                })
                if(!list){
                  wx.showToast({
                    title: '搜索不到该蓝牙设备',
                  })
                  _this.setData({
                    visible:false
                  })
                  return false;
                }else{
                  console.log("list.deviceId:",list.deviceId);
                  _this.setData({
                    deviceId:list.deviceId
                  })
                  _this.getBlue(list.deviceId)
                }
                wx.stopBluetoothDevicesDiscovery({
                  success (res) {
                   clearInterval(timer)
                   console.log("停止搜索：",res)
                  }
                })
                
              
                
              }

                // if(tnDeviceList.length >0){
                //   _this.setData({
                //     // visible:false,
                //      deviceList: tnDeviceList
                //    },()=>{
                //      wx.stopBluetoothDevicesDiscovery({
                //        success (res) {
                //         clearInterval(timer)
                //         console.log("停止搜索：",res)
                //        }
                //      })
                //    });
                  
                // }
             
              //}
            })
          },5000)
           
          
          }
        })
       
       
      },
      fail: function (res) {
        wx.showToast({
          title: '蓝牙不可用',
        })
      
      }

    })
  },
  // 获取搜索到的设备信息
  getBlue(id){
    let _this = this;

    // wx.getStorage({
    //    key: 'deviceId',
    //    success:res=>{
    //      console.log("09090:",res.data)
    //      id = res.data;
    //         // 搜索蓝牙设备（消耗大量资源，要及时结束）

    //    }
    //  });

    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        // 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
        setTimeout(() => {
          wx.getBluetoothDevices({
            success:(res)=>{
             _this.connetBlue(id)
              // wx.stopBluetoothDevicesDiscovery({
              //   success (res) {
              //   },
              //   fail (res) {
              //     console.log(res,"关闭搜索失败")
              //   }
              // });
            }
          })
        }, 1000);
       
      }        
    })

 
  },
  // 获取到设备之后连接蓝牙设备
  connetBlue(deviceId){ 
    const _this = this;
    console.log("deviceId:",deviceId)
    wx.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      success (res) {
     
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
                     console.log("服务所支持的操作:",res)
           
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
                         console.log("onBLECharacteristicValueChange:",res)
                        if(str.length<242){
                          str+=ab2hex(res.value)
                          return false;
                        }else{
                          str=ab2hex(res.value)
                        }
                      _this.setData({
                        blueStr:str.substr(212,4)
                      })
                        
                        // 获取设备信息
                      _this.getDeviceInfo(str)
                      wx.closeBLEConnection({
                        deviceId:deviceId
                      });
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
        const {errMsg} =err;
        wx.showToast({
          title:errMsg
        })
      }
    })
  },
  // 获取设备信息
  getDeviceInfo(str){
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
      //  console.log("电池状态",BatterySatusText);
      //  console.log("电池温度",BatteryTempText);
      //  console.log("mos温度", mosTempText);
      //  console.log("充电器匹配检测电压",Voltage1Text);
      //  console.log("放电电流:",dischargeText);
      //  console.log("充电电流:",discharge1Text);
      //  console.log("单体电压",Voltage2Text);
      //  console.log('充电截至电压:',Voltage3Text)
      //  console.log('电池总压:',Voltage4Text)
      //  console.log('固件版本:',version1Text)
      //  console.log('硬件版本:',version2Text)
      //  console.log('电池规则:',typeText)
      //  console.log('mac地址:',mac)
       
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
  },
  // 检测
  goTest:function () {
    const arr = [0,1,2,3,5,6,10,11];
    let num=0;
    const str =  hex_to_bin(this.data.blueStr).split("");
    for(var i=0;i<arr.length;i++){
      if(str[arr[i]]==0){
        num+=100;
      }
    }
    wx.setStorage({
      key:"num",
      data:num
    })
    wx.navigateTo({
      url:`/pagesDevice/pages/testIng/index?blueStr=${this.data.blueStr}`
    })
    
  }
})