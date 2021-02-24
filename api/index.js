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

// 产品绑定/解绑客户 post
const handleBindPDevice = data=> fetch('productApi/binding',data,{method:"post"})

// 分页查询文章简要信息 get
const getArticleList =  data=> fetch('articleApi/briefPage',{size:pageSize,...data})

// 通过id查询文章详情
const getArticleDetail =  data=> fetch(`article/${data}`,data)

// 通过产品码（激光码）查询产品信息 get
const getBlueInfoByProductCode = data=>fetch('/product/getByProductCode',data,{all:true})

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
  getBlueInfoByProductCode
}