var Api = require('../../../utils/api.js')
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util')
var config = require('../../../config')
Page({
    data: {
        userInfo: {},
        logged: false,
        course_list: [],
    },
    onLoad: function (options) {
        this.getUserInfo('teacher')
    },
    onShow: function () {
        this.login();
        this.getCourseList()
    },
    
    login: function () {
        if (this.data.logged) return
            // util.showBusy('正在登录')
        var that = this
        qcloud.login({
            success(result) {
                if (result) {
                    // util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            // util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },
                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },
            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },
    getUserInfo: function (character) {
        console.log("in getUserInfo...");
        var that = this
        wx.request({
            url: config.service.getUserInfoUrl,
            method: 'POST',
            data: {
                table_name: character,
                open_id: app.globalData.userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                that.setData({
                    teacher_name: res.data.data[0].name
                })
            }
        });
    },
    editTeacherInfo: function (e) {
        console.log("修改教师信息")
        var url = '../setTeacherInfo/setTeacherInfo?if_first_time=false'
        wx.navigateTo({
            url: url,
        })
    },
    addCourse: function (e) {
        wx.redirectTo({
            url: '../addCourse/addCourse'
        })
    },
    getCourseList: function (e) {
        console.log("in getCourseList...")
        var that = this
        wx.request({
            url: config.service.getCourseListUrl,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                open_id: app.globalData.userInfo.openId
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    course_list: res.data.data
                });
            }
        });
    }
})