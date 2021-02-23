// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event) => {
	try {
		var RecID = ""
		const result = await db.runTransaction(async transaction => {
			await transaction.collection('AccountInfo').add({
				data: event.AccInfo
			})
			
			await transaction.collection('PurchaseRec').add({
			  data: event.PurInfo, 
			  success: function(res) { 
			  },
			  fail: console.error
			})
		})
	} catch (e) {
		return {
			success: false,
			error: e
		}
	}
}
