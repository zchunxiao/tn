import {fetch} from "../utils/fetch"

// 分页接口
const pageSize=10;
// banner轮播图片 get
const getBannerList = (data)=> fetch('banner/list',data)
 
// 微信授权 get
const wxLogin = (data)=>  fetch('miniUser/wxLogin',data)

// 手机绑定 post
const bindPhone = (data)=> fetch('/miniUser/bindOpenId',data,{method:"post"})

// 检测是否绑定手机号 get
const isBindPhone = (data)=> fetch('/miniUser/checkPhoneBinding',data)

// 获取用户绑定的设备列表 get
const getListProductByUser = (data)=>fetch('product/listProductByUser',data,{loading:false})

// 通过id查询商品 get
const getProductById  =({deviceId})=> fetch(`product/${deviceId}`) 

// 电池产品绑定/解绑客户 post
const handleBindPDevice = data=> fetch('productApi/binding',data,{method:"post"})

// 分页查询文章简要信息 get
const getArticleList =  data=> fetch('articleApi/briefPage',{size:pageSize,...data})

// 通过id查询文章详情
const getArticleDetail =  data=> fetch(`article/${data}`,data)

// 通过产品码（激光码）查询产品信息 get
const getBlueInfoByProductCode = data=>fetch('product/getByProductCode',data,{loading:false})

// 意见反馈 post 
const getFeedBack = data => fetch(`feedback/feedBack?feedBack=${data}`,{},{method:"post"})

// 联系我们 get
const getContactUs = data=> fetch('contact/page');

// 修改客户信息
const editUserInfo = data =>fetch('user',data,{method:"put"})

// 查询用户
const getUserInfo = data=>fetch(`user/getUserByPhone?phoneNumber=${data}`)

// 绑定检测仪 post 绑定/解绑检测仪(1:绑定 2:解绑)
const testBind  = data =>{
  const {name,type} = data;
  return fetch(`detectorApi/binding?name=${name}&type=${type}`,{},{method:"post"})
}

// 获取配置参数 get
const getConfigParams = ()=>fetch('configParamsApi/getConfigParams');


// 检测仪检测 post
const getTest = data=>fetch('api/test',data,{method:"post"})

module.exports= {
  getBannerList,
  wxLogin,
  bindPhone,
  isBindPhone,
  getListProductByUser,
  getProductById,
  handleBindPDevice,
  getArticleList,
  getArticleDetail,
  getBlueInfoByProductCode,
  getFeedBack,
  getContactUs,
  editUserInfo,
  getUserInfo, 
  testBind,
  getConfigParams,
  getTest
}