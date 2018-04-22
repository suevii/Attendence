// pages/chooseCharacter/chooseCharacter.js
const app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var util = require('../../utils/util.js')
var config = require('../../config')

Page({
    data: {
        userInfo: {},
        logged: false,
    },

    onShow: function () {
        this.login()
    },
    //从服务器获取已选择的用户身份
    getUserCharacter: function (e) {
        var that = this
        console.log("in getUserCharacter: " + that.data.userInfo.openId)
        wx.request ({
            url: config.service.getUserCharacterUrl,
            method: 'POST',
            data: {
                open_id: that.data.userInfo.openId
                // open_id: "1"
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log("res:");
                console.log(res);
                if (res.data.data.length == 0)
                    // 用户未选择过身份，则留在当前页进行选择
                    console.log("User hasn't chosen character yet!")
                else {
                    // 用户已选择过身份
                    // util.showBusy('正在跳转')
                    var if_teacher = res.data.data[0].if_teacher;
                    console.log("if_teacher?: " + if_teacher)
                    if (if_teacher == 1) {
                        //用户已选择过身份为teacher，则转到teacher页面
                        console.log("User is teacher");
                        that.getTeacherInfo();
                        wx.redirectTo({
                            url: '../teacher/teacherMain/teacherMain',
                        });
                    } else {
                        //用户已选择过身份为student，则转到student页面
                        console.log("User is student");
                        that.getUserInfo('student');
                        // wx.redirectTo({
                        //     url: '../student/uploadImage/uploadImage',
                        // });
                    }
                    // util.showSuccess('获取if_teacher成功');
                }
            }
        });
    },
  
    login: function () {
        if (this.data.logged) 
            return util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success (result) {
                if (result) {
                    //首次登录
                    util.showSuccess('登录成功')
                    console.log("首次的userInfo:(为啥没有openId，未解之谜，不管了强行登录，嘻嘻) ")
                    console.log(result)
                }
                // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                qcloud.request({
                    url: config.service.requestUrl,
                    login: true,
                    success(result) {
                        util.showSuccess('登录成功')
                        that.setData({
                            userInfo: result.data.data,
                            logged: true
                        })
                        console.log(result)
                        console.log("login")
                        that.setGlobalData();
                        that.getUserCharacter();
                    },
                    fail(error) {
                        util.showModel('请求失败', error)
                        console.log('request fail', error)
                    }
                });
                console.log(that.data.userInfo);
            },
            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },

    studentUser: function (e) {
        var that = this;
        wx.showModal({
            title: '确认身份',
            content: '选择身份后无法修改，请确认！',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    wx.request({
                        url: config.service.setUserCharacterUrl,
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        data: {
                            open_id: that.data.userInfo.openId,
                            if_teacher: 0
                        },
                        success: function (res) {
                            console.log(res.data)
                            util.showSuccess('学生信息提交成功');
                        }
                    });
                    that.setGlobalData();
                    that.getUserInfo('student');
                    wx.redirectTo({
                        url: '../student/uploadImage/uploadImage',
                    });
                }
            }
        });
    },

    teacherUser: function (e) {
        var that = this;
        wx.showModal({
            title: '确认身份',
            content: '选择身份后无法修改，请确认！',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    wx.request({
                        url: config.service.setUserCharacterUrl,
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        data: {
                            open_id: that.data.userInfo.openId,
                            if_teacher: 1
                        },
                        success: function (res) {
                            console.log(res.data)
                            util.showSuccess('教师信息提交成功');
                        }
                    });
                    that.setGlobalData();
                    that.getTeacherInfo();
                    wx.redirectTo({
                        url: '../teacher/teacherMain/teacherMain',
                    })
                }
            }
        });
    },
    getUserInfo: function(character){
        var that = this
        wx.request({
            url: config.service.getUserInfoUrl,
            method: 'POST',
            data: {
                table_name: character,
                open_id: that.data.userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log("After get " + character + "info");
                console.log(res);
                if (res.data.data.length == 0) {
                    var redirectUrl = ''
                    if (character == 'teacher'){
                        redirectUrl = '../teacher/setTeacherInfo/setTeacherInfo'
                    }else {
                        redirectUrl = '../student/setStudentInfo/setStudentInfo'
                    }
                    console.log(character + " hasn't set infomation yet!");
                    console.log("redirectUrl: " + redirectUrl)
                    wx.redirectTo({
                        url: redirectUrl
                    });
                }else {
                    wx.redirectTo({
                        url: '../student/uploadImage/uploadImage',
                    });
                }
            }
        });
    },
    getTeacherInfo: function (e) {
        var that = this
        wx.request({
            url: config.service.getUserInfoUrl,
            method: 'POST',
            data: {
                table_name: 'teacher',
                open_id: that.data.userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log("res:");
                console.log(res);
                if (res.data.data.length == 0){
                    console.log("Teacher hasn't set name yet!");
                    wx.redirectTo({
                        url: '../teacher/setTeacherInfo/setTeacherInfo',
                    });
                }
            }
        });
    },
    setGlobalData: function (e) {
        app.globalData.userInfo = this.data.userInfo;
        console.log("globalData的userInfo: ");
        console.log(app.globalData.userInfo);
    },
    //下面的没用到
    openConfirm: function (e) {
        var character = e.detail.name
        console.log(e);
        wx.showModal({
            title: '确认身份',
            content: '选择身份后无法修改，请确认！',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    //do sth.
                } else {
                    //do sth.
                }
            }
        });
    },
    testData: function (e) {
        wx.request({
            url: config.service.testUrl,
            method: 'POST',
            header: {
            'content-type': 'application/json' // 默认值
            },
            success: function (res) {
            console.log(res.data)
            util.showSuccess('提交成功');
            }
        })
    }
})