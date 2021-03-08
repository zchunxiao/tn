// pages/deviceList/index.js
import {handleBindPDevice,getListProductByUser,getBlueInfoByProductCode,testBind} from '../../../api/index.js'
import {getStorageByKey, hexToStr,hexToDecimalism,ab2hex} from '../../../utils/index.js'
import {replaceUrl} from '../../../utils/index.js'
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blueToothIsOpen:false,
    model:"" ,//设备名称
    deviceList:[], // 可用设备列表
    deviceConnectList:[], // 已连接设备
    deviceInfo:{},
    saomaResult:"",
    visible:false,
    text:"搜索中",
    snCode:"",
    isUseBlueTooth:false // 检测蓝牙是否可用
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
    const _this = this;
    _this.getList();
    _this.getSetting();
  
    // 蓝牙连接
    _this.initBlue();
    // 获取设备信息
    _this.setData({
       model:wx.getSystemInfoSync().model
    })
  },
  getList:function() {
    const _this = this;
    getListProductByUser().then(data=>{
      let result = (data||[]).map(item=>{
        item.productImgUrl =   replaceUrl(item.productImgUrl);
        return item;
      })
      _this.setData({
        deviceConnectList:result
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
     clearInterval(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.isUseBlueTooth && wx.closeBluetoothAdapter();
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
   * 扫码先判断是否授权过地址
   */
  saoma:function(){
    const _this = this;
    if (!getStorageByKey('location')){
      _this.getSetting();
    }else{
      _this.emitSaoMa()  
    }
  },
  // 触发扫码
  emitSaoMa:function(){
    const _this = this;
    wx.scanCode({
      scanType:"qrCode",
      success:res=>{
        console.log("uuuu:",res);
        if(!res) return false;
        const {result} = res;
        this.setData({
          saomaResult:result
        })
        _this.handleSaoMa(result)
      }
    })
  },
  // 扫码请求
  handleSaoMa:function(result){
    const _this = this;
    getBlueInfoByProductCode({
      productCode:result
    }).then(res=>{
      console.log("ssaoma:",res)
      if(!res){
        return false;
      }
      const {latitude,longitude} = getStorageByKey('location');
      const {snCode,blueToothName} = res
      // 绑定当前的设备
      _this.bindBlueTooth(blueToothName,latitude,longitude,snCode,_this);
      setTimeout(function() {
        _this.getList();
      },1000)
  
    })
  },
  // 初始化蓝牙
 initBlue:function(){
  var that = this;
  // wx.showLoading({
  //    title: '加载中',
  //    mask:true
  // })

  wx.openBluetoothAdapter({
    success:(res)=>{
      that.setData({
        blueToothIsOpen: true,
       // visible:true
      })
      // wx.showLoading({
      //   title:"搜索中1",
      //   mask:true
      // })
      // that.setData({
      //   visible:true,
      //   text:this.data.text
      // })
      that.findBlue();
      that.setData({
        isUseBlueTooth:true
      })
   
    },
    fail:(err)=>{
      wx.showToast({
        title: '请开启蓝牙',
        icon: 'fails',
        duration: 1000
      })
      that.setData({
        blueToothIsOpen: false
      })
    },
  })
 },
 // 开始
 findBlue:function(){
   let that = this;
   let id,time=0;

  wx.getBluetoothAdapterState({
    success: function (res) {
      if(!res.available) return false;
      // 搜索蓝牙设备（消耗大量资源，要及时结束）
      wx.startBluetoothDevicesDiscovery({
        services: [],
        success: function (res) {
          // 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
          // 每隔5秒中搜索一次列表
          time++;
           timer = setInterval(() => {
            wx.getBluetoothDevices({
              success:(res)=>{
              
                let tnDeviceList = res.devices.filter(item=>{
                  return item.name.indexOf("TN") > -1
                });
                
                console.log("设备列表:",tnDeviceList)
                // if(tnDeviceList.length == 0){
                //   that.initBlue()
                // }else{
                  if(tnDeviceList.length >0){
                    that.setData({
                      // visible:false,
                       deviceList: tnDeviceList
                     },()=>{
                       wx.stopBluetoothDevicesDiscovery({
                         success (res) {
                          clearInterval(timer)
                          console.log("停止搜索：",res)
                         }
                       })
                     });
                    
                  }
               
                 // wx.hideLoading();
                //  that.setData({
                //     visible:false,
                //     text:that.data.text
                //   })
               // }
               
  
              }
            });
          
           }, 5000);
         
        }        
      })
  
    },
    fail: function (res) {

      wx.showToast({
        title: '蓝牙不可用',
      })
      that.stopBluetoothDevicesDiscovery();
    }
  
  })
 },


  /**
   * 绑定蓝牙设备
   */
  bindDevice:function(e){
   
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name;
    const _this = this;
    
    // 检测仪
    if(name.startsWith("TNTM")){
      console.log("检测仪绑定:")
      testBind({
        name:name,
        type:1
      }).then(data=>{
        if(data && data == '操作成功'){
          wx.showToast({
            title:'绑定成功',
            duration:2000
          })
          setTimeout(() => {
            wx.switchTab({
              url:"/pages/index/index"
            })
          }, 2000);
        }
        
      })
      return false;
     
    }
    console.log("电池绑定")
    if (!getStorageByKey('location')){
      _this.getSetting();
    }else{
      _this.setData({
        visible:true,
        text:"绑定中"
      })
      const {latitude,longitude} = getStorageByKey('location');
      _this.connetBlue(deviceId,name,latitude,longitude,_this.data.snCode,_this);
      
      // 绑定当前的设备
      // setTimeout(() => {
      //   console.log("绑定蓝牙1")
      //   _this.bindBlueTooth(name,latitude,longitude,getStorageByKey('snCode')||"",_this,deviceId);
      // }, 1000);
    } 
    
  
  
   
  },
  // 获取到设备之后连接蓝牙设备
  connetBlue(deviceId,name,latitude,longitude,code,that){ 
    console.log("连接蓝牙")
    const _this = this,finish = false;
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
                        },
                        fail:function(err){
                          console.log(err)
                        }
                      })
                      
                      let str="";
                      wx.onBLECharacteristicValueChange(function (res) {
                        console.log("0000000000000999999:",ab2hex(res.value));
                        if(str.length<242){
                          str+=ab2hex(res.value)
                          return false;
                        }
                     
                        // 获取设备信息
                        if(str.length == 242){
                          _this.getDeviceInfo(str)
                          //callback();
                          //_this.bindBlueTooth();
                          _this.bindBlueTooth(name,latitude,longitude,code,that)
                          name,latitude,longitude,code,that
                          wx.closeBLEConnection({
                            deviceId: deviceId,
                            success:function(res){
                              console.log("关闭设备连接成功",res)
                            },
                            fail:function(res){
                              console.log("关闭设备连接失败",res)
                            }
                          })
                        }
                      })
                      
                    }
                })
        
            },
            fail:function(err){
              console.log(err)
            }
          })
      },
      fail (err){
        console.log(err);
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

        console.log("##########解析sn码",sncodeText);
        // console.log("电池状态",BatterySatusText);
        // console.log("电池温度",BatteryTempText);
        // console.log("mos温度", mosTempText);
        // console.log("充电器匹配检测电压",Voltage1Text);
        // console.log("放电电流:",dischargeText);
        // console.log("充电电流:",discharge1Text);
        // console.log("单体电压",Voltage2Text);
        // console.log('充电截至电压:',Voltage3Text)
        // console.log('电池总压:',Voltage4Text)
        // console.log('固件版本:',version1Text)
        // console.log('硬件版本:',version2Text)
        // console.log('电池规则:',typeText)
        // console.log('mac地址:',mac)

        const _deviceInfo = {
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
        wx.setStorage({
          key:'snCode',
          data:sncodeText
        })
        _this.setData({
          connectStatus:true,
        //  snCode:sncodeText,
          deviceInfo:_deviceInfo
        })

  },
  // 绑定蓝牙设备
  bindBlueTooth:(blueToothName,latitude,longitude,snCode,that)=>{
  console.log("绑定蓝牙设备");
      const params = {
        bindType:1, //绑定类型(1:绑定 2:解绑)
        blueToothName,
        latitude,
        longitude,
        snCode:getStorageByKey("snCode") || "",
      }
   
    
      that.setData({
        visible:false
      })
      console.log("params:",params)
      handleBindPDevice(params).then(data=>{
        console.log("绑定蓝牙设备:",data)
        if(data && data == '操作成功'){
          wx.showToast({
            title:'绑定成功',
            duration:2000
          })
          // if(id){
          //   wx.setStorage({
          //     data: deviceId ,
          //     key: id,
          //   })
          // }
          setTimeout(() => {
            wx.switchTab({
              url:"/pages/index/index"
            })
          }, 2000);
        }
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
          const {name,snCode,type} =  ds;
          _this.handleDeleteDevice(name,snCode,type);
        }
      }
    })
  },
  // 删除设备
  handleDeleteDevice:function(name,snCode,type){
    if(type ==2){
      testBind({
        name,
        type:2,
      }).then(data=>{
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
      return false;
    }

      const params = {
        bindType:2, //绑定类型(1:绑定 2:解绑)
        blueToothName:name,
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
  //获取用户的当前设置
  getSetting:function(){ 
    const _this = this;
    wx.getSetting({
      success: (res) => {

        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true)                     {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.goAddress();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.goAddress();
        }
        else {
          // console.log('授权成功')
          //调用wx.getLocation的API
          _this.goAddress();
        }
      }
    })
  },
  // 获取地址
  goAddress:function() {
    wx.getLocation({
      success: res=> {
        if(!res) return false;
        wx.setStorage({
          key:"location",
          data:res
        })
      }
    })
  }
})