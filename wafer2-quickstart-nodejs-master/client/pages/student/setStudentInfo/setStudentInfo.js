// pages/student/setStudentInfo/setStudentInfo.js
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var config = require('../../../config')
Page({

    /**
     * 页面的初始数据
     */
    data: {
    
    },

    addStudent: function (e){
        var that = this
        var student_name = e.detail.value.student_name;
        var student_id = e.detail.value.student_id;
        wx.request({
            url: config.service.addStudentUrl,
            data: {
                student_open_id: app.globalData.userInfo.openId,
                name: student_name,
                student_id: student_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data)
                util.showSuccess('提交成功');
            }
            
        })
        wx.redirectTo({
            url: '../uploadImage/uploadImage',
        })
    }
})