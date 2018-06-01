// pages/student/setStudentInfo/setStudentInfo.js
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
        if(options.if_first_time){
            this.setData({
                if_first_time: options.if_first_time
            })
        }
        console.log("if_first_time: " + this.data.if_first_time)
    },

    addStudent: function (e){
        var that = this,
            student_name = e.detail.value.student_name,
            student_id = e.detail.value.student_id;
        if (that.data.if_first_time == 'true' || that.data.if_first_time == true){
            console.log("in addStudent")
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
                    console.log(res)
                    util.showSuccess('提交成功');
                    wx.redirectTo({
                        url: '../studentMain/studentMain',
                    })
                }
            });
        } else if (that.data.if_first_time == false || that.data.if_first_time == "false"){
            console.log("in alterStudent")
            wx.request({
                url: config.service.alterStudentUrl,
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
                    console.log(res)
                    util.showSuccess('提交成功');
                    wx.redirectTo({
                        url: '../studentMain/studentMain',
                    })
                }
            })
        }
    }
})