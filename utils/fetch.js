import {getStorageByKey} from './index.js'
const baseUrl ="https://lidian.etianneng.cn/bms"


/**
 * @param {all} 响应体全部返回 
 * @param {loading} 请求是否显示loading效果
 */
const fetch = (url="",data={},option={method:'get',all:false,loading:true}) => {
  if(!url) {
    wx.showToast({
      title: '请求地址不能为空',
      mask:true
    })
    return false;
  }
  if(option.loading){
    wx.showLoading({
      title:"加载中"
    });
  }

  return new Promise((resolve,reject)=>{
    wx.request({
      url:baseUrl+"/"+url,
      data,
      header:{
       "TENANT-ID": "2",
      //"Authorization":"Bearer 0bb1c716-1f61-4f66-814f-46950f03d66e",   
       "Authorization":getStorageByKey('token')||""
      },
      method:option.method,
      success:res=>{
       const {data:{code,msg,data}} =  res;
    
       if(code != 0){
         wx.showToast({
           title: msg,
           icon: 'error',
           duration:2000,
           mask:true
         })
        console.log("接口异常:",msg);
        reject(msg)
       }
        if(option.all){
          resolve(res.data)
        }else{
          resolve(data)
        }
        option.loading &&  wx.hideLoading();
       
      },
      fail:err=>{
        option.loading &&  wx.hideLoading();
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