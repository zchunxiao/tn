import * as echarts from '../../components/ec-canvas/echarts';
import {hex_to_bin,getStorageByKey} from "../../../utils/index.js"
const app = getApp();


function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
      name: '业务指标',
      type: 'gauge',
      min:0,
      max:800, 
      detail: {
        formatter: '{value}'
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 30,
          shadowBlur: 0,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      data: [{
        value: getStorageByKey("num")||0,
        name: '检测结果',
      }]

    }]
  };

  chart.setOption(option, true);

  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  
  data: {
    ec: {
      onInit: initChart
    },
    itemList:[
     {
      title:"电压总压检测",
      showLoading:true,
      status:"",
      index:0,
     },
     {
      title:"单体电压检测",
      showLoading:true,
      status:"",
      index:1
     },
       {
      title:"MOS过猛检测",
      showLoading:true,
      status:"",
      index:2,
     },
     {
      title:"AFE前端芯片故障",
      showLoading:true,
      status:"",
      index:3,
     },
     {
      title:"掉线检测",
      showLoading:true,
      status:"",
      index:5
     },
     {
      title:"电芯温度检测",
      showLoading:true,
      status:"",
      index:6,
     },
     {
      title:"充电过流检测",
      showLoading:true,
      status:"",
      index:10,
     },
     {
      title:"放电过流检测",
      showLoading:true,
      status:"",
      index:11,
     }
  ],
  list:[]
  },

  onReady() {
  },
  onShow(){
    const _this = this;
    for(let i = 0;i<8;i++){
      setTimeout(()=>{

        const num = _this.data.itemList[i].index;
        const status = _this.data.list[num];

        console.log("11:",num ,_this.data.list,status)
        _this.data.itemList[i].showLoading = false;
        _this.data.itemList[i].status = status;
        _this.setData({
             itemList: _this.data.itemList
           })
      },i*1000)
      
    }
  },
  onLoad(option){
    const {blueStr} = option;
    
    this.setData({
      list: hex_to_bin(blueStr).split("")
    })
   

  },
   // 查看详情
   goMore:function () {
    wx.navigateTo({
      url:`/pagesDevice/pages/report/index`
    })
  }
});










