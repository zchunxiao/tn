// pages/article/index.js
import {replaceUrl, test} from '../../../utils/index.js'
import {getArticleDetail} from "../../../api/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVideo:false,
    nodes:'',
    articleInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options:",options)
    const {articleId} = options;
    const _this = this;
    //  测试数据
    let d  = {
      "articleId": "1363653951754768386",
      "articleTitle": "test",
      "articleBrief": "test",
      "articleType": "picture",
      "thumbnailUrl": "http://192.168.33.129:9000/dosp/daccb132f6fe45ba80babaa0fbb0098d.jpg",
      "articleContent": "<div class=\"a-con\" style=\"color: #191919; font-size: 16px; padding-top: 5px; overflow: hidden; line-height: 26px; position: relative; font-family: 'PingFang SC', Helvetica, 'Microsoft YaHei', simsun, sans-serif; background-color: #f9f9f9;\"> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\">2月19日，新疆边检总站伊犁边境管理支队八十间房子边境派出所民警带领两名护边员，前往洪达坂区域进行巡逻，并查看边境设施有无因暴雪损坏。近日，新疆伊犁河谷普降暴雪，导致部分达坂的道路被齐腰深的积雪及雪崩阻断。洪达坂位于中哈边境，海拔3700余米，属于高寒缺氧的高原山区。图为步行穿越雪崩高发地区。 郭玮 摄</p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\"><img style=\"border: none; max-width: 100%; display: block; height: auto; margin: 10px auto 20px;\" src=\"https://rs-channel.huanqiucdn.cn/imageDir/e7f0b948ceba8e942038e44a21a18a47.png\"></p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\">因巡逻路线被大雪覆盖，民警带领护边员牵马在齐腰深的积雪中步行前往达坂。 郭玮 摄</p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\"><img style=\"border: none; max-width: 100%; display: block; height: auto; margin: 10px auto 20px;\" src=\"https://rs-channel.huanqiucdn.cn/imageDir/6fb479c188291345026e088fc16dc344.png\"></p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\">趟过冰河。 郭玮 摄</p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\"><img style=\"border: none; max-width: 100%; display: block; height: auto; margin: 10px auto 20px;\" src=\"https://rs-channel.huanqiucdn.cn/imageDir/f936fdfc39dcc301887a84506c017c72.png\"></p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\">手脚并用前行。 郭玮 摄</p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\"><img style=\"border: none; max-width: 100%; display: block; height: auto; margin: 10px auto 20px;\" src=\"https://rs-channel.huanqiucdn.cn/imageDir/3eb3c0e702b523b4a89fbb5b58eec691.png\"></p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\">新疆边检总站伊犁边境管理支队八十间房子边境派出所民警带领两名护边员，前往洪达坂区域进行巡逻，并查看边境设施有无因暴雪损坏。 郭玮 摄</p> \n <p style=\"margin: 10px 0px 20px; padding: 0px; list-style: none; line-height: 30px; word-break: break-all;\">&nbsp;</p> \n</div> \n<div class=\"a-edit\" style=\"color: #999999; font-size: 12px; overflow: hidden; margin-top: 30px; line-height: 30px; margin-bottom: 5px; font-family: 'PingFang SC', Helvetica, 'Microsoft YaHei', simsun, sans-serif; background-color: #f9f9f9;\">\n <span class=\"a\" style=\"float: right;\">责编：秦璐敏</span>\n</div>",
      "appModule": "test",
      "articleSeq": 1,
      "articleStatus": "1",
      "delFlag": "0",
      "createBy": "admin",
      "createTime": "2021-02-22 08:56:52",
      "updateBy": "admin",
      "updateTime": "2021-02-22 08:57:01",
      "remark": "",
      "articleContentBase64": null
    }
    getArticleDetail(articleId).then(data=>{
     // console.log("djhfjdhf:",data)
      if(!data.thumbnailUrl ) return false;
      data.thumbnailUrl =  replaceUrl(data.thumbnailUrl);
      _this.setData({
        articleInfo:data,
        nodes:data 
      })
    })

    // let data = '<div><h3 style="color:red">javascript - <em>js同步编程</em>与异步编程的区别,异步有哪些优点,为什么...</h3><div><span>2016年5月20日 - </span>从编程方式来讲当然是<em>同步编程</em>的方式更为简单,但是同步有其局限性一是假如是单线程那么一旦遇到阻塞调用,会造成整个线程阻塞,导致cpu无法得到有效利用...</div><div><div></div><span ><span ></span></span> - 百度快照</div><div ><span>为您推荐：</span>js同步和异步ajax异步和同步的区别</div></div>';
   // this.setData({ nodes:data })
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

  }
})