// pagesDevice/pages/Detector/index.js
import {getConfigParams,getTest} from "../../../api/index.js"
import {string2buffer,ab2hex,hex2ab} from "../../../utils/index.js"
let timer,timer1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chargeCommand:"",
    chargeTime:"",
    dischargeCommand:"",
    dischargeTime:"",
    freezeCommand:"",
    freezeTime:"",
    intervalTime:"",
    isUseBlueTooth:false,
    name:"",
    deviceId:"",
    writeText:"" ,// 蓝牙写入数据
    baseInfo:[],
    pid:"",
    blueToothCmd:"", // 发送蓝牙指令
    testType:1 ,//检测类型(1:快速检测,2:全程检测)
    stage:1,//检测仪目前状态(1:充电中,2：静止中,3:放电中)
    cd100:"",
    serviceId:""
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {name}= options;
    this.setData({
      name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 修改数据
  changeText:function(num1,num2,num3,callback1,callback2,callback3,time){

    var timer,i=0,j=0,k=0;
    timer=setInterval(()=>{
      i++;
      if(i<num1+1){
    
        callback1()
      }else{
        j++;
        if(j<num2+1){
        
          callback2()
          
        }else{
          k++;
            if(k<num3+1){
          
              callback3()
            
            }else{
              clearInterval(timer)
            }
        }
      }
    },time)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
    const _this = this;
 
    getConfigParams().then(data=>{
      console.log("获取配置参数:",data)
      const {
        chargeCommand,
        chargeTime,
        dischargeCommand,
        dischargeTime,
        freezeCommand,
        freezeTime,
        intervalTime
      } = data;
      _this.setData({
        chargeCommand,
        chargeTime,
        dischargeCommand,
        dischargeTime,
        freezeCommand,
        freezeTime,
        intervalTime,
        blueToothCmd: chargeCommand
      })
    });
    _this.initBlue();

  

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
  // 查看详情
  goMore:function () {
    wx.navigateTo({
      url:`/pagesDevice/pages/report/index`
    })
  },

  // 初始化蓝牙
  initBlue:function(){
    var that = this;
    wx.openBluetoothAdapter({
      success:()=>{
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
      },
    })
  },
  // 开始
  findBlue:function(){
    let _this = this;
    let time=0;

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
                    return item.name.indexOf("TNTM") > -1
                  });
     

                  let list;
                  tnDeviceList.map(item=>{
                    if(item.name == _this.data.name){
                      list = item;
                    }
                  })
                  if(!list){
                    wx.showToast({
                      title: '搜索不到该蓝牙设备',
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
              });
            
            }, 5000);
          
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
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
     
        // 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
        setTimeout(() => {
          wx.getBluetoothDevices({
            success:(res)=>{
              _this.connetBlue(id)
        
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
      
          // 获取特定设备的所有服务
          wx.getBLEDeviceServices({
              deviceId:deviceId,
              success: function(res) {
                 
                  const serviceId = res.services.map(item=>{
                      return item.uuid
                  })
                  console.log("蓝牙连城serviceId:",serviceId)
              

                  // 针对一个特定服务查看这个服务所支持的操作
                  wx.getBLEDeviceCharacteristics({
                      deviceId: deviceId,
                      serviceId: serviceId[1],
                      success: function (res) {
                        console.log("服务所支持的操作(读写操作):",res.characteristics)
              
                        let characteristicId=res.characteristics.map(item=>{
                          return item.uuid
                        })
                        console.log("characteristicId:",characteristicId)
                        let cd100= characteristicId[1];//读取第二个特征值
                
                        _this.setData({
                          cd100,
                          serviceId: serviceId[1]
                        })
                         setTimeout(() => {
                          _this.writeCmd(cd100,serviceId[1]);//开始写命令到特征值

                          wx.notifyBLECharacteristicValueChange({//监听特征值变化
                              state: true,
                              deviceId:  _this.data.deviceId,
                              serviceId: serviceId[1],
                              characteristicId: cd100,
                              success(res) { 
                                console.log("监听成功:",res.errMsg)
                              },
                              fail(err){
                                console.log("监听失败:",err)
                              }
                          })

                          wx.onBLECharacteristicValueChange(function (res) {//获取蓝牙特征值变化
                            console.log("获取蓝牙特征值变化:",res.value)
                            var cmd = ab2hex(res.value);//获取到特征值
                            console.log("数据包:",cmd);
                            _this.data.baseInfo.push(cmd);
                            //_this.data.baseInfo.push("5A0A007900000B700B6A0000000000000F5E0F5D0F5D0F5E0F5E0F5E0F5C0F5B0F5E0F5F0F5D0F5E0F5C000000000000000000000000000013E10000C7BD0100010000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000B670B660BA20F5D0328000006500000C300000000E2C7000050000000000000000000000002");
                            console.log("数据包数组",_this.data.baseInfo);
                      
                            _this.hanldeCheck(_this.data.baseInfo,_this.pid)
           
                        
                          })
                       
                        }, 2000);


                  
                      }
                  })
          
              },
              fail:function(err){
                console.log("res.services;err",err)
              }
            })
        },
        fail (err){
          console.log("err:",err)
        }
      })
  },
  // 蓝牙写入数据
  writeCmd: function (cd100,serviceId) {
      var _this = this;
      let cmd = _this.data.chargeCommand;//写入蓝牙的指令 需转为buffer
    
      console.log("指令:",cmd.replace(/\s*/g,""));
      console.log("ll:",_this.data.blueToothCmd)
      console.log("122:",hex2ab(_this.data.blueToothCmd.replace(/\s*/g,"")))
   

      _this.changeText(
        _this.getNum(_this.data.chargeTime),
        _this.getNum(_this.data.freezeTime),
        _this.getNum(_this.data.dischargeTime),
         function(){
           console.log("1")
           _this.setData({
             blueToothCmd:_this.data.chargeCommand,
             stage:1, //检测仪目前状态(1:充电中,2：静止中,3:放电中)
           })
           console.log("0000蓝夜写入:",d100,serviceId,_this.data.chargeCommand);
           _this.writeBlueToothCmd(cd100,serviceId,_this.data.chargeCommand)
         },
         function(){
           console.log("2")
           _this.setData({
             blueToothCmd:_this.data.freezeCommand,
             stage:2
           })
           console.log("0000蓝夜写入2:",cd100,serviceId,_this.data.freezeCommand)
           _this.writeBlueToothCmd(cd100,serviceId,_this.data.freezeCommand)
         },
         function(){
           console.log("3")
           _this.setData({
             blueToothCmd:_this.data.dischargeCommand,
             stage:3
           })
           console.log("0000蓝夜写入3:",cd100,serviceId,_this.data.dischargeCommand)
           _this.writeBlueToothCmd(cd100,serviceId,_this.data.dischargeCommand)
           wx.closeBLEConnection({//断开连接
              deviceId:_this.data.deviceId,
              success(res) { }
            })
         },
         //1000
         _this.data.intervalTime*1000
      )
  
  },

  // 写入蓝牙命令
  writeBlueToothCmd:function( cd100,serviceId,cmd){

    const _this  = this;
    console.log("cmd写入:",cmd)
    setTimeout(function () {
      wx.writeBLECharacteristicValue({
        deviceId: _this.data.deviceId,
        serviceId: serviceId,
        characteristicId: cd100,
        value:hex2ab(cmd.replace(/\s*/g,"")),
        success(res) {
          console.log("写入成功:",res)
          wx.readBLECharacteristicValue({//写入成功后读取该特征值
              deviceId:  _this.data.deviceId,
              serviceId: serviceId,
              characteristicId: cd100,
              success(res) {
                console.log("读取成功:",res)
              },
              fail(err) { 
                console.log("读取失败:",err)
              }
          })
        }, 
        fail(err) {
          console.log("写入失败:",err)
        // _this.writeCmd(cd100,serviceId);
        }
      })
    }, 2000)
  },
  // 获取蓝牙操作次数
  getNum:function(type){
    return Math.ceil(type/this.data.intervalTime)
  },
  // 检测仪按钮事件
  goCheck:function(e){
    const {type} =  e.currentTarget.dataset;

    const _this = this;
    _this.setData({
      testType:type
    })
  

  },
  // 检测仪检测
  hanldeCheck:function(baseInfo,pid){
    const _this  = this;
    let param = {
      baseInfo,//检测数据包
      pid,//数据编号
      stage:_this.data.stage,//检测仪目前状态(1:充电中,2：静止中,3:放电中)
      testType:_this.data.testType     //       testType:1 //检测类型(1:快速检测,2:全程检测)
    }
    console.log("检测入参:",param)
    getTest(param).then(data=>{
      console.log("检测仪数据:",data)
      const {pid} = data;
      _this.setData({
        pid
      })
    
    })
  }
})


