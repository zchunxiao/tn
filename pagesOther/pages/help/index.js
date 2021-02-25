// pages/help/index.js
import {getBannerList,getArticleList} from '../../../api/index.js'
import {replaceUrl} from '../../../utils/index.js'

let globalBannerList = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],// 轮播图列表
    current:1 ,//当前轮播图索引
    articleId:"" // 轮播图查看详情articleId
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    // 查询轮播图片
    _this.handleBannerList();
    // 查询文章列表
    _this.handleArticleList();
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
    console.log("下拉")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { 
    console.log("触底上拉加载")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 文章
  goArticle:function(e){
    const ds = e.currentTarget.dataset
    // 轮播图并且存在文章id
    if(ds.type=="banner" && this.articleId){
      wx.navigateTo({
        url: `/pagesOther/pages/article/index?articleId=${this.articleId}`
      })
    }else{ // 文章列表
      wx.navigateTo({
        url: `/pagesOther/pages/article/index?articleId=${ds.articleId}`
      })
    }
  },
  // 获取当前轮播图
  _swiperChange:function(e){
    this.setData({
      current:e.detail.current,
      articleId:globalBannerList[e.detail.current].articleId
    })
  },
  // 轮播图
  handleBannerList:function(){
    const _this = this;
    getBannerList({bannerType:2}).then(res=>{
      if(!res) return false;
      let result = res.map(item=>{
        item.bannerUrl = replaceUrl(item.bannerUrl)
        return item
      })
      _this.setData({
            bannerList:result 
      })
      globalBannerList = result;
    });
  },
  // 文章列表
  handleArticleList:function(){
    const _this = this;
    getArticleList({page:1}).then(res=>{
      if(!res) return false;
      const {records} = res;
      let result =records.map(item=>{
        item.thumbnailUrl= replaceUrl(item.thumbnailUrl)
        return item
      })
      _this.setData({
        articleList:result
      })
    })
  }
})