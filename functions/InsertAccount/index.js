// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();
 
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("AccountInfo").add({
      data: {
        UserName:"123" ,
        Tel: "123456",
      }, success: res => {
        wx.showToast({
          title: '订单发起成功',
        })
      }, fail: err => {
        wx.showToast({
          icon: 'none',
          title: '订单发起失败',
        })
      }
    })
  } catch (e) {
    console.log(e)
  }
}
