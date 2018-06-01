// pages/teacher/teacherInfo/teacherInfo.js
// done
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var config = require('../../../config')
Page({

    data: {
        if_first_time: true
    },

    onLoad: function (options) {
        if (options.if_first_time){
            this.setData({
                if_first_time: options.if_first_time
            })
            console.log("if_first_time: " + this.data.if_first_time)
        }
    },

    addTeacher: function (e) { 
        var that = this,
            teacher_name = e.detail.value.teacher_name;
        if (that.data.if_first_time == 'true' || that.data.if_first_time == true) {
            console.log("in addTeacher...")
            wx.request({
                url: config.service.addTeacherUrl,
                data: {
                    open_id: app.globalData.userInfo.openId,
                    name: teacher_name
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    console.log(res)
                    util.showSuccess('提交成功');
                    wx.redirectTo({
                        url: '../teacherMain/teacherMain',
                    })
                }
            });
        } else if (that.data.if_first_time == false || that.data.if_first_time == "false") {
            console.log("in alterTeacher...")
            wx.request({
                url: config.service.alterTeacherUrl,
                data: {
                    open_id: app.globalData.userInfo.openId,
                    name: teacher_name,
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    console.log(res)
                    util.showSuccess('修改成功');
                    wx.redirectTo({
                        url: '../teacherMain/teacherMain',
                    })
                }
            })
        }
    }
})