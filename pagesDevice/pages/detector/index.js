// pagesDevice/pages/Detector/index.js
import {getConfigParams,getTest} from "../../../api/index.js"
import {string2buffer,ab2hex,hex2ab,buf2hex,hex_to_bin,str2ab} from "../../../utils/index.js"
let timer;

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
    baseInfo:[],// 数据包
    pid:"",
    blueToothCmd:"", // 发送蓝牙指令
    testType:1 ,//检测类型(1:快速检测,2:全程检测)
    stage:1,//检测仪目前状态(1:充电中,2：静止中,3:放电中)
    cd100:"",
    serviceId:"",
    notifyCd100:""
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
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
    setTimeout(() => {
      _this.initBlue();
    }, 1000);
  

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
         console.log("初始化蓝牙");
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
            // timer = setInterval(() => {
            setTimeout(() => {
              wx.getBluetoothDevices({
                success:(res)=>{
                
                  let tnDeviceList = res.devices.filter(item=>{
                    return item.name.indexOf("TNTM") > -1
                  });
     
                  console.log("蓝牙列表:",tnDeviceList);
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
            // }, 5000);
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
                   console.log("蓝牙serviceId:",serviceId)
              

                  // 针对一个特定服务查看这个服务所支持的操作
                  wx.getBLEDeviceCharacteristics({
                      deviceId: deviceId,
                      serviceId: serviceId[1],
                      success: function (res) {
                        // console.log("服务所支持的操作(读写操作):",res.characteristics)
              
                        let characteristicId=res.characteristics.map(item=>{
                          return item.uuid
                        })
                        // console.log("characteristicId:",characteristicId)
                        let cd100= characteristicId[1];//读取第二个特征值写入数据 测试的时候可以取第三个数据测试
                        let cd101 = characteristicId[0];//读取第已个特征值获取数据
         

                        _this.setData({
                          cd100,
                          notifyCd100:cd101,
                          serviceId: serviceId[1]
                        })
              
                        _this.writeCmd();//开始写命令到特征值

                        // setTimeout(() => {

                          wx.onBLECharacteristicValueChange(function (res) {//获取蓝牙特征值变化
                            var cmd = buf2hex(res.value);//获取到特征值
                            //console.log("数据包:",cmd);
                            if(cmd.length <100){
                              return false;
                            }
                           // console.log("_this.data.baseInfo:", _this.data.baseInfo.length)
                            _this.data.baseInfo.push(cmd);
                           // console.log("_this.data.baseInfo:", _this.data.baseInfo.length)
                          })
                          wx.notifyBLECharacteristicValueChange({//监听特征值变化
                            state: true,
                            deviceId:  _this.data.deviceId,
                            serviceId: serviceId[1],
                            characteristicId: _this.data.notifyCd100,
                            success(res) { 
                         
                              console.log("监听成功:",res.errMsg)
                            },
                            fail(err){
                              console.log("监听失败:",err)
                            }
                          })
                      

                        //  }, 2000);


                  
                      }
                  })
          
              },
              fail:function(err){
                console.log("res.services;err",err)
              }
            })
        },
        fail (err){
          const {errCode} = err;
          if(errCode == "10003"){
            wx.showToast({
              title:"连接超时"
            })
          }
         
        }
      })
  },
  // 蓝牙写入数据
  writeCmd: function () {
     console.log("蓝牙写入数据入口")
      var _this = this;
      const {chargeTime,dischargeTime,freezeTime,intervalTime} = _this.data;
      // 先充电
      _this.handleCharge();
      setTimeout(() => {
        // 静止
        _this.handleFreeze();
        setTimeout(() => {
          // 放电
          _this.handleDischarge();
          setTimeout(() => {
            // 静止
            _this.handleFreeze("last");
          }, dischargeTime*1000);
        }, freezeTime*1000);
      },chargeTime*1000);

  },
  // 写入蓝牙命令
  writeBlueToothCmd:function(callback,cmd,last){

    const _this  = this;
    const {cd100,serviceId,deviceId} = _this.data;
    console.log("cmd写入:",cmd)
    var hex = cmd.replace(/\s*/g,""); // 16进制去处空格
    var buffer1 = hex2ab(hex);// 16进制转arrayBuffer
    console.log("buffer1:",buffer1)
    // setTimeout(function () {
    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: cd100,
      // value:hex2ab(cmd.replace(/\s*/g,"")),
      value:buffer1,
      success(res) {
        console.log("写入成功:",res,)
        wx.readBLECharacteristicValue({//写入成功后读取该特征值
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: cd100,
            success(res) {
              console.log("读取成功:",res,_this.data.baseInfo);
              typeof callback  == 'function' && callback();
              //断开连接
              if(last && last=="last"){
                wx.closeBLEConnection({
                  deviceId:deviceId,
                  success(res) { 
                    console.log("成功断开连接")
                  }
                })
              }
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
    // }, 2000)
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
  hanldeCheck:function(baseInfo){
    const _this  = this;
    const {pid,stage,testType} = _this;

    let param = {
      baseInfo,//检测数据包
      pid,//数据编号
      stage,//检测仪目前状态(1:充电中,2：静止中,3:放电中)
      testType //检测类型(1:快速检测,2:全程检测)
    }
   
    console.log("检测入参:",param)
  
    getTest(param).then(data=>{
     console.log("*********检测仪数据*********:",data)
      const {pid} = data;
      _this.setData({
        pid,
        baseInfo:[]
      })
    },err=>{
      console.log('接口调用:',err)
    })
  },
  // 充电指令
  handleCharge:function(){
    console.log("开始充电")
    const _this = this;
    const {chargeCommand,intervalTime,chargeTime,baseInfo} = _this.data;
    let timerBlue1,c=0;
    _this.setData({
      blueToothCmd:chargeCommand,
      stage:1, //检测仪目前状态(1:充电中,2：静止中,3:放电中)
    })
   
    // 充电指令回调
    _this.writeBlueToothCmd(()=>{
      _this.hanldeCheck(baseInfo)

      timerBlue1 = setInterval(()=>{
        // 充电次数
        var num = _this.getNum(chargeTime)
          c++;
          console.log("i:",c);
          console.log("ssdS:",baseInfo)
          _this.hanldeCheck(baseInfo)

          if(c>num-1){
            clearInterval(timerBlue1)
          }
        },intervalTime*1000)

    },chargeCommand)
  },
  //静止指令
  handleFreeze:function(last){
    console.log("开始静止")

    const _this = this;
    const {freezeCommand,freezeTime,intervalTime,baseInfo} =_this.data;
    let timerBlue2,f=0;
    _this.setData({
      blueToothCmd:freezeCommand,
      stage:2, //检测仪目前状态(1:充电中,2：静止中,3:放电中)
    })

    _this.writeBlueToothCmd(()=>{
      timerBlue2 = setInterval(()=>{
        _this.hanldeCheck(baseInfo)

        // 充电次数
        var num = _this.getNum(freezeTime)
          f++;
         
          console.log("ssdS:",baseInfo)
          if(f>num-1){
            console.log("f:",f);
            clearInterval(timerBlue2)
          }
        },intervalTime*1000)

    },freezeCommand,last)
  },
  // 放电指令
  handleDischarge:function(){
    console.log("开始放电")
    const _this = this;
    const {dischargeCommand,dischargeTime,intervalTime,baseInfo} = _this.data;
    let timerBlue3,d=0;
    _this.setData({
      blueToothCmd:dischargeCommand,
      stage:3, //检测仪目前状态(1:充电中,2：静止中,3:放电中)
    })

    _this.writeBlueToothCmd(()=>{
      _this.hanldeCheck(baseInfo)
          timerBlue3 = setInterval(()=>{
          // 充电次数
            var num = _this.getNum(dischargeTime)
            d++;
            console.log("ssdS:",baseInfo)
          
            if(d>num-1){
              console.log("d:",d);
              clearInterval(timerBlue3)
            }
          },intervalTime*1000)
    },dischargeCommand)
  },
  // 蓝牙写入数据
  hanldeCheckTest:function(){
    const _this = this;
    const {chargeTime,dischargeTime,freezeTime} = _this.data;
    // 先充电
    _this.handleCharge();
    // return false;
    setTimeout(() => {
      // 静止
      _this.handleFreeze();
      setTimeout(() => {
        // 放电
        _this.handleDischarge();
        setTimeout(() => {
          // 静止
          _this.handleFreeze("last");
        }, dischargeTime*1000);
      }, freezeTime*1000);
    },chargeTime*1000);

  }
})