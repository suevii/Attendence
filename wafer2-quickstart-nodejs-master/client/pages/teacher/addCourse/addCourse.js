// pages/teacher/addCourse/addCourse.js
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var config = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

    addCourse: function(e) {
        console.log("in addCourse: " + app.globalData.userInfo.openId);
        wx.request({
            url: config.service.addCourseUrl,
            data: {
                id: e.detail.value.course_id,
                name: e.detail.value.course_name,
                open_id: app.globalData.userInfo.openId
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
    },
    formReset: function (e) {
        console.log('form发生了reset事件')
        util.showSuccess('重置成功');
    }
})