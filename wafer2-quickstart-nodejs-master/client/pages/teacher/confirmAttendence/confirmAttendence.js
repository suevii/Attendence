// pages/teacher/confirmAttendence/confirmAttendence.js
const app = getApp();
var util = require('../../../utils/util')
var config = require('../../../config')
Page({
    data: {
        // recognized_student: [],         // 前一页面传递过来的face_id
        recognized_student_open_id: [],
        recognized_student_info: [],    // 用student_open_id获取的学生具体信息
        select_id: [],                   // select_info表的select_id
        date: '',
    },
    onLoad: function (options) {
        var date = util.formatDate(new Date());
        this.setData({
            date: date,
            course_id: options.course_id,
            // recognized_student: JSON.parse(options.recognized_student)
            recognized_student_open_id: JSON.parse(options.recognized_student_open_id)
        });
    },

    onShow: function () {
        console.log("in confirm attendence recognized_student_open_id:")
        console.log(this.data.recognized_student_open_id)

        this.showRecognitionResult()
    },

    showRecognitionResult: function(){
        var that = this
        wx.request({
            url: config.service.getFaceOwnerUrl,
            header: {
                'content-type': 'application/json',
            },
            data: {
                course_id: that.data.course_id,
                teacher_open_id: app.globalData.teacher_open_id,
                recognized_student_open_id: that.data.recognized_student_open_id
            },
            method: 'POST',
            success: function (res) {
                console.log("in showRecognitionResult")
                console.log(res)
                that.setData({
                    recognized_student_info: res.data.data
                })
                console.log(that.data.recognized_student_info)
            }
        })
    },
    
    // 点击【确定】
    confirmAttendence: function () {
        var that = this
        console.log(that.data.recognized_student_info)
        if (that.data.recognized_student_info.length != 0) {

            var attend_date = that.data.date;
            var select_id = that.data.select_id;
            wx.request({
                url: config.service.addAttendenceUrl,
                header: {
                    'content-type': 'application/json',
                },
                data: {
                    course_id: that.data.course_id,
                    teacher_open_id: app.globalData.userInfo.openId,
                    recognized_student_open_id: that.data.recognized_student_open_id,
                    attend_date: attend_date
                },
                method: 'POST',
                success: function (res) {
                    console.log("in confirmAttendence")
                    console.log(res)
                    if (!res.data.error) {
                        wx.showToast({
                            title: '记录完成',
                            icon: 'success',
                            duration: 2000,
                            success: function () {
                                setTimeout(function () {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }, 2000)
                            }
                        });
                    }
                }
            })
        }
    },
    
    navigateBack: function(){
        wx.navigateBack({
            delta: 1
        })
    },


    checkboxChange: function (e) {
        var confirmed_student = this.data.recognized_student_info;
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        // var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        // for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        //     checkboxItems[i].checked = false;

        //     for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        //         if (checkboxItems[i].value == values[j]) {
        //             checkboxItems[i].checked = true;
        //             break;
        //         }
        //     }
        // }

        // this.setData({
        //     checkboxItems: checkboxItems
        // });
    },

    dateChange: function (event) {
        console.log("in date change")
        console.log(event.detail.value)
        this.setData({
            date: event.detail.value,
        })
    },
    previewImage: function (e) {
        var img_url = e.currentTarget.dataset.url

        wx.previewImage({
            urls: [img_url] // 需要预览的图片http链接列表
        })
    }
})