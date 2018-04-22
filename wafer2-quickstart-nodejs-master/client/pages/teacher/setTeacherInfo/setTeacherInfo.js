// pages/teacher/teacherInfo/teacherInfo.js
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

    addTeacher: function (e) { 
        console.log(e.detail.value.teacher_name)
        console.log(app.globalData.userInfo.openId)
        wx.request({
            url: config.service.addTeacherUrl,
            data: {
                open_id: app.globalData.userInfo.openId,
                name: e.detail.value.teacher_name
            },
            method: 'POST',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data)
                util.showSuccess('提交成功');
            }
        });
        wx.redirectTo({
            url: '../teacherMain/teacherMain',
        })
    }
})