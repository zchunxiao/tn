// pages/fastTest/index.js
import uCharts from '../../components/u-charts/u-charts.min'
var _self;
var canvaColumn = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cWidth: '',
    cHeight: '',
  },
  ready() {
  
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _self=this;
    this.cWidth = wx.getSystemInfoSync().windowWidth;
    this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.getServerData()
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
  tapDialogButton:function(){
    console.log("jjjj")
  },
  getServerData: function () {
    wx.request({
      url: 'https://www.ucharts.cn/data.json',
      data: {
      },
      success: function (res) {
        let Column = { categories: [], series: [] };
        Column.categories = res.data.data.ColumnB.categories;
        Column.series = res.data.data.ColumnB.series;
        //自定义标签颜色和字体大小
        Column.series[1].textColor = 'red';
        Column.series[1].textSize = 11;
        _self.showColumn("canvasColumn", Column);
      },
      fail: () => {
        console.log("请点击右上角【详情】，启用不校验合法域名");
      },
    })
  },
  showColumn(canvasId, chartData) {
    canvaColumn = new uCharts({
      $this: _self,
      canvasId: canvasId,
      type: "line",
      legend: true,
      fontSize: 11,
      background: '#FFFFFF',
      pixelRatio: 1,
      animation: true,
      categories: chartData.categories,
      series: chartData.series,
      xAxis: {
        disableGrid: true,
      },
      yAxis: {  
        //disabled:true
      },
      dataLabel: true,
      width: _self.cWidth ,
      height: _self.cHeight ,
      extra: {
        column: {
          type: 'group',
          width: _self.cWidth * 0.45 / chartData.categories.length
        }
      }
    });
  }
})