// pages/chooseCharacter/chooseCharacter.js
// 核对流程
const app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var util = require('../../utils/util.js')
var config = require('../../config')

Page({
    data: {
        userInfo: {},
        logged: false,
        authorized: false
    },
    onShow: function () {
        var that = this
        wx.getSetting({
            success: function (res) {
                // 用户是否已授予使用userInfo的权限
                if (res.authSetting['scope.userInfo']) {
                    console.log("已获userInfo使用授权")
                    that.setData({
                        authorized: true
                    })
                    that.login()
                }
            }
        }) 
    },
    //从服务器获取已选择的用户身份
    getUserCharacter: function (e) {
        var that = this
        console.log("in getUserCharacter... ")
        wx.request ({
            url: config.service.getUserCharacterUrl,
            method: 'POST',
            data: {
                open_id: that.data.userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                if (res.data.data.length == 0)
                    // 用户未选择过身份，则留在当前页进行选择
                    console.log("User hasn't chosen character yet!")
                else {
                    // 用户已选择过身份,
                    // 获取userInfo（id和姓名），若未设置userInfo则setUserInfo
                    var if_teacher = res.data.data[0].if_teacher;
                    console.log("if_teacher?: " + if_teacher)
                    if (if_teacher == 1) {
                        that.getUserInfo('teacher');
                    } else if (if_teacher == 0){
                        that.getUserInfo('student');
                    }
                }
            }
        });
    },
  
    login: function () {
        console.log("in login")
        if (this.data.logged) 
            return util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success (result) {
                if (result) {
                    //首次登录
                    // util.showSuccess('登录成功')
                    console.log("首次的userInfo:")
                    console.log(result)
                }
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
                        console.log(result)
                        that.setGlobalData();
                        that.getUserCharacter();
                    },
                    fail(error) {
                        util.showModel('请求失败', error)
                        console.log('request fail', error)
                    }
                });
            },
            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },
    setUserCharacter: function(e) {
        console.log("in setUserCharacter...")
        var that = this
        var character = e.currentTarget.dataset.character,
            if_teacher = -1,
            if_teacher_info = '';
        if (character == "student"){
            if_teacher = 0;
            if_teacher_info = '学生'
        } else if (character == "teacher"){
            if_teacher = 1;
            if_teacher_info = '教师'
        }
        wx.showModal({
            title: '确认身份',
            content: '您选择的身份是：' + if_teacher_info +'\n选择身份后无法修改，请确认！',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: config.service.setUserCharacterUrl,
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        data: {
                            open_id: that.data.userInfo.openId,
                            if_teacher: if_teacher
                        },
                        success: function (res) {
                            console.log(res)
                            util.showSuccess('身份提交成功');
                        }
                    });
                    that.setGlobalData();
                    that.getUserInfo(character);
                }
            }
        });
    },
    // 获取教师或学生的id和姓名
    getUserInfo: function(character){
        console.log("in getUserInfo...");
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
                console.log(res);
                if (res.data.data.length == 0) {
                    console.log(character + "未设置个人信息");
                    var redirectUrl = ''
                    if (character == 'teacher'){
                        redirectUrl = '../teacher/setTeacherInfo/setTeacherInfo'
                    }else {
                        redirectUrl = '../student/setStudentInfo/setStudentInfo'
                    }
                    console.log("redirectUrl: " + redirectUrl)
                    wx.redirectTo({
                        url: redirectUrl
                    });
                }else {
                    console.log(character + " 已设置个人信息");
                    var mainUrl = ''
                    if (character == 'teacher') {
                        mainUrl = '../teacher/teacherMain/teacherMain'
                    } else {
                        mainUrl = '../student/studentMain/studentMain'
                    }
                    wx.redirectTo({
                        url: mainUrl
                    });
                }
            }
        });
    },
    showRelaunchHint: function(){
        wx.showModal({
            content: '重启后生效，即将自动重启',
            showCancel: false,
            confirmText: '知道了',
            success: function (res) {
                wx.reLaunch({
                    url: 'chooseCharacter',
                })
            }
        });
    },
    // 设置openid
    setGlobalData: function (e) {
        console.log("in setGlobalData...")
        app.globalData.userInfo = this.data.userInfo;
    },
})