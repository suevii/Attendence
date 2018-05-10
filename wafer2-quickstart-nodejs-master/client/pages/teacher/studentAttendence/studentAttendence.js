// pages/teacher/studentAttendence/studentAttendence.js
const app = getApp();
var config = require('../../../config')
var util = require('../../../utils/util.js')

Page({

    data: {
        date: '',
        course_id: '',
        attend_list: []
    },

    onLoad: function (options) {
        var date = util.formatDate(new Date());
        console.log("date:")
        console.log(date)
        this.setData({
            date: date,
            course_id: options.course_id
        });
    },

    onShow: function () {
        // this.getStudentAttendence()
        this.getAttendList()
    },

    dateChange: function (event) {
        console.log(event.detail.value)
        this.setData({
            date: event.detail.value,
        })
        // this.getStudentAttendence()
        this.getAttendList()
    },

    getAttendList: function (e) {
        var that = this
        wx.request({
            url: config.service.getAttendListUrl,
            method: 'POST',
            data: {
                attend_date: that.data.date,
                course_id: that.data.course_id,
                teacher_open_id: app.globalData.userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log("in getAttendList")
                console.log(res)
                that.setData({
                    attend_list: res.data.data
                })
                console.log(that.data.attend_list)
            }
        })
    }
})