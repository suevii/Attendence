// pages/teacher/addCourse/addCourse.js
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var config = require('../../../config.js')
Page({

    data: {
        invitation_code: '',
        showTopTips: false,
        topTipContent: ""
    },

    generateCode: function (e) {
        console.log("In generateCode...")
        var num = util.generateNumber(new Date()),
            open_id = app.globalData.userInfo.openId;
        var alphabet = open_id.substring(open_id.length - 5, open_id.length - 1).toLowerCase()    //openId后四位
        this.setData({
            invitation_code: alphabet + num
        })
        console.log(this.data.invitation_code)
    },
    /*
        1. 生成课程邀请码
        2. 添加到数据库course表
        3. create face group
    */
    addCourse: function(e) {
        console.log("in addCourse")
        this.generateCode()

        var that = this
        var access_token = app.globalData.access_token;
        var create_face_group_url = "https://aip.baidubce.com/rest/2.0/face/v3/faceset/group/add?access_token=" + access_token;
        wx.request({
            url: config.service.addCourseUrl,
            data: {
                id: e.detail.value.course_id,
                course_name: e.detail.value.course_name,
                teacher_open_id: app.globalData.userInfo.openId,
                invitation_code: that.data.invitation_code
            },
            method: 'POST',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res)
                if (res.data.code == 100){
                    that.setData({
                        showTopTips: true,
                        topTipContent: res.data.data
                    });
                    setTimeout(function () {
                        that.setData({
                            showTopTips: false
                        });
                    }, 3000);
                }
                else if (res.data.code == 0) {
                    wx.request({
                        url: create_face_group_url,
                        data: {
                            group_id: that.data.invitation_code
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (res) {
                            util.showSuccess('添加课程成功');
                            wx.redirectTo({
                                url: '../teacherMain/teacherMain',
                            })
                        }
                    })
                }else{
                    console.log("添加失败")
                }
            }
        });
    }
})