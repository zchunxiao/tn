var app = getApp();

// 16进制转字符串
function hexToStr(hexCharCodeStr) {
  　　var trimedStr = hexCharCodeStr.trim();
  　　var rawStr = 
  　　trimedStr.substr(0,2).toLowerCase() === "0x"
  　　? 
  　　trimedStr.substr(2) 
  　　: 
  　　trimedStr;
  　　var len = rawStr.length;
  　　if(len % 2 !== 0) {
  　　　　alert("Illegal Format ASCII Code!");
  　　　　return "";
  　　}
  　　var curCharCode;
  　　var resultStr = [];
  　　for(var i = 0; i < len;i = i + 2) {
  　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
  　　　　resultStr.push(String.fromCharCode(curCharCode));
  　　}
  　　return resultStr.join("");
  }


// 16进制转10进制
function hexToDecimalism (hex)  {
    var len = hex.length, a = new Array(len), code;
    for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (48<=code && code < 58) {
            code -= 48;
        } else {
            code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
    }
     
    return a.reduce(function(acc, c) {
        acc = 16 * acc + c;
        return acc;
    }, 0);
}

// ArrayBuffer转16进制
function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
    return ('00' + bit.toString(16)).slice(-2)
    }
    )
    return hexArr.join('');
}



// 图片地址替换
function replaceUrl(url){
   let index = url.indexOf("9000"),arr =[];
   if(index>-1){
       arr =  url.split("9000");
     return `https://lidian.etianneng.cn${arr[1]}`
   }else{
       return url;
   }

}



// 获取storage中的信息
function getStorageByKey(key){
  try {
    var value = wx.getStorageSync(key)
    if (value) {
      return value
      // Do something with return value
    }
  } catch (e) {
    return ""
    // Do something when catch error
  }
}

//获取openid
// function getOpenid (callback){
//   wx.getStorage({
//     key:'openid',
//     success(res){
//      console.log("opendid:",res)
//      typeof callback  == 'function' &&  callback(res.data)
//     },
//     fail(err){
//       console.log("opendid111:",err)
//       typeof callback  == 'function' &&  callback('')
//     }
//   })
// }

// //  获取sessionKey
// function getSessionKey(callback){
//   wx.getStorage({
//     key:'session_key',
//     success(res){
//      console.log("session_key:",res)
//      typeof callback  == 'function' &&  callback(res.data)
//     },
//     fail(err){
//       typeof callback  == 'function' &&  callback('')
//     }
//   })
// }



// // 获取手机号
// function getPhoneNumber(){
//   try {
//     var value = wx.getStorageSync('phoneNumber')
//     if (value) {
//       return value
//       // Do something with return value
//     }
//   } catch (e) {
//     return ""
//     // Do something when catch error
//   }
// }


// 验证是否授权登录
function isLogin(){
  try {
    var value = wx.getStorageSync('token');
    if (value) {
      return value
    }
  } catch (e) {
    return ""

  }


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



module.exports={
  hexToStr,
  hexToDecimalism ,
  ab2hex,
  replaceUrl,
  // getOpenid,
  // getSessionKey,
  isLogin,
  getStorageByKey,
  test
}


