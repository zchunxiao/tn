import * as echarts from '../../components/ec-canvas/echarts';

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
      detail: {
        formatter: '{value}%'
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
        value: 40,
        name: '完成率',
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
      showLoading:true
     },
     {
      title:"单体电压检测",
      showLoading:true
     },
       {
      title:"MOS过猛检测",
      showLoading:true
     },
     {
      title:"AFE前端芯片故障",
      showLoading:true
     },
     {
      title:"掉线检测",
      showLoading:true
     },
     {
      title:"电芯温度检测",
      showLoading:true
     },
     {
      title:"充电过流检测",
      showLoading:true
     },
     {
      title:"放电过流检测",
      showLoading:true
     }
  ]
  },

  onReady() {
  },
  onShow(){
    const _this = this;
    for(let i = 0;i<8;i++){
      setTimeout(()=>{
        console.log("ddd:",i, _this.data)
        _this.data.itemList[i].showLoading = false;
        _this.setData({
             itemList: _this.data.itemList
           })
       // _this.itemList[i]
      //  _this.setData({
      //    itemList:_this.itemList[i].showLoading = false
      //  })
      },i*1000)
    }
  },
   // 查看详情
   goMore:function () {
    wx.navigateTo({
      url:`/pagesDevice/pages/report/index`
    })
  }
});










