import {getStorageByKey} from './index.js'
const baseUrl ="https://lidian.etianneng.cn/bms"


const fetch = (url="",data={},option={method:'get',all:false}) => {
  if(!url) {
    wx.showToast({
      title: '请求地址不能为空',
    })
    return false;
  }
  wx.showLoading({
    title: '加载中'
  });

  return new Promise((resolve,reject)=>{
    wx.request({
      url:`${baseUrl}/${url}`,
      data,
      header:{
       "TENANT-ID": "2",
      //"Authorization":"Bearer 0bb1c716-1f61-4f66-814f-46950f03d66e",   
       "Authorization":getStorageByKey('token')||""
      },
      method:option.method,
      success:res=>{
       const {data:{code,msg,data}} =  res;
       wx.hideLoading();
       if(code != 0){
         wx.showToast({
           title: msg,
           icon: 'error',
           duration:2000
         })
       }
      
        if(option.all){
          resolve(res)
        }else{
          resolve(data)
        }
       
      },
      fail:err=>{
        wx.hideLoading();
        reject(err)
      }
    })
  })
}


const test = (data)=>{
  return new Promise((resolve,reject)=>{
    if(data){
      resolve(data)
    }else{
      reject("出错了")
    }
  })
}

module.exports = {
  fetch,
  test
}