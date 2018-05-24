// pages/student/studentCourse/studentCourse.js
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var config = require('../../../config')
Page({

    data: {
        student_id: "",
        // user_img_url: "",
        user_face_token: "",
        studentCourseList: [],
        inputShowed: false,
        inputVal: "",
        showTopTips: false,
        topTipContent: ""
    },

    onLoad: function (options) {
        this.setData({
            student_id: options.student_id,
            // user_img_url: options.user_img_url,
            user_face_token: options.user_face_token
        });
    },

    onShow: function () {
        this.getStudentCourseList();
    },

    getStudentCourseList: function (e) {
        var that = this
        wx.request({
            url: config.service.getStudentCourseListUrl,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                student_open_id: app.globalData.userInfo.openId
            },
            success: function (res) {
                console.log("getStudentCourseList success")
                console.log(res)
                for(var i = 0; i <res.data.data[0].length; i ++){
                    res.data.data[0][i]["open"] == false
                }
                that.setData({
                    studentCourseList: res.data.data[0]
                });
            }
        });
    },
    // 查找数据库中是否有对应课程
    searchCode: function(e){
        console.log("查找课程中")
        var that = this
        var invitation_code = e.detail.value,
            student_open_id = app.globalData.userInfo.openId;
        wx.request({
            url: config.service.searchCodeUrl,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                student_open_id: student_open_id,
                invitation_code: invitation_code
            },
            success: function (res) {
                console.log("searchCode success")
                console.log(res)
                if (res.data.code == 100 || res.data.code == 101) {
                    that.setData({
                        showTopTips: true,
                        topTipContent: res.data.data
                    });
                    setTimeout(function () {
                        that.setData({
                            showTopTips: false
                        });
                    }, 3000);
                } else {
                    var course_open_id = res.data.data[0].course_open_id,
                        course_id = res.data.data[0].id,
                        course_name = res.data.data[0].course_name,
                        teacher_name = res.data.data[0].name,
                        teacher_open_id = res.data.data[0].teacher_open_id;
                    var modal_content = '课程号：' + course_id + '\n课程名：' + course_name + '\n教师：' + teacher_name
                    wx.showModal({
                        title: '是否要加入该课程？',
                        content: modal_content,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                that.addStudentToCourse(course_open_id, course_id, teacher_open_id, invitation_code)
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }
        });
    },
    addStudentToCourse: function (course_open_id, course_id, teacher_open_id, invitation_code) {
        console.log("in addStudentToCourse")
        var that = this
        var student_open_id = app.globalData.userInfo.openId,
            access_token = app.globalData.access_token;
        var add_to_face_group_url = "https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=" + access_token;
        wx.request({
            // add face to face group
            url: add_to_face_group_url,
            header: {
                'content-type': 'application/json'
            },
            data: {
                'image': that.data.user_face_token,
                'image_type': 'FACE_TOKEN',
                'group_id': invitation_code,
                'user_id': that.data.student_id,
                'user_info': student_open_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                wx.request({
                    url: config.service.addStudentToCourseUrl,
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        course_open_id: course_open_id,
                        course_id: course_id,
                        teacher_open_id: teacher_open_id,
                        student_open_id: student_open_id
                    },
                    success: function (res) {
                        console.log("addStudentToCourse result: ")
                        console.log(res)
                        wx.showToast({
                            title: '加入课程成功',
                            icon: 'success',
                            duration: 3000,
                            success: function () {
                                that.getStudentCourseList()
                            }
                        })
                    }
                })
            }

        })
    },
    getStudentAttendDate: function(e){
        console.log("in getStudentAttendDate")
        var that = this, 
            select_id = e.currentTarget.dataset.selectid,
            list = this.data.studentCourseList;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].select_id == select_id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            studentCourseList: list
        });
        wx.request({
            url: config.service.getStudentAttendDateUrl,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                select_id: select_id
            },
            success: function (res) {
                console.log("getStudentAttendDate success")
                console.log(res)
                for(var i = 0; i < res.data.data.length; i ++){
                    res.data.data[i].attend_date = res.data.data[i].attend_date.substring(0,10)
                }
                that.setData({
                    attendDateList: res.data.data
                })
            }
        });
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    }
})