// pages/student/uploadImage/uploadImage.js
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var config = require('../../../config')
Page({

    data: {
        userInfo: {},
        logged: false,
        requestResult: '',
        files: [],
        face_uploaded: false,
        show_uploader: true,
        user_img_url: "",
        user_face_token: ""
    },
    onLoad: function (options) {
        this.getUserInfo('student')
        this.getFaceInfo()
    },
    onShow: function () {
        this.login()
    },

    switchUploader: function(){
        console.log("点我")
        console.log(this.data.show_uploader)
        var switch_show_uploader = !(this.data.show_uploader)
        this.setData({
            show_uploader: switch_show_uploader
        })
    },
    // 用户登录示例
    login: function() {
        // if (this.data.logged) return
        //     util.showBusy('正在登录')
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
    // 获取学号和姓名
    getUserInfo: function (character) {
        var that = this
        wx.request({
            url: config.service.getStudentUrl,
            method: 'POST',
            data: {
                table_name: character,
                student_open_id: app.globalData.userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log("After get " + character + " info");
                console.log(res);
                that.setData({
                    student_id: res.data.data[0].student_id,
                    student_name: res.data.data[0].name
                })
            }
        });
    },
    editStudentInfo: function(e) {
        console.log("修改学生信息")
        var url = '../setStudentInfo/setStudentInfo?if_first_time=false'
        wx.navigateTo({
            url: url,
        })
    },
    // 获取是否上传了照片
    getFaceInfo: function(e) {
        var that = this
        wx.request({
            url: config.service.getFaceInfoUrl,
            header: {
                'content-type': 'application/json'
            },
            data: {
                "student_open_id": app.globalData.userInfo.openId
            },
            method: 'POST',
            success: function (e) {
                console.log("in getFaceInfo")
                console.log(e.data)
                if (e.data.data.length != 0){
                    if (e.data.data[0].length != 0 && e.data.data[0].img_url != "") {
                        that.setData({
                            face_uploaded: true,
                            show_uploader: false,
                            user_img_url: e.data.data[0].img_url,
                            user_face_token: e.data.data[0].face_token
                        })
                    }
                }
            },
            fail: function (e) {
                console.log("get face info fail")
                console.log(e.data)
            }
        });

    }, setFaceInfo1: function () {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]
                that.setData({
                    file_to_upload: filePath
                });
            }
        })
    },

    setFaceInfo: function () {
        console.log("in setFaceInfo")
        var that = this
        var access_token = app.globalData.access_token;
        var detect_url = "https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=" + access_token;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]
                that.setData({
                    file_to_upload: filePath
                });
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',
                    success: function (res) {
                        console.log(res)
                        // 这里就是要parse:)
                        res = JSON.parse(res.data)
                        that.setData({
                            imgUrl: res.data.imgUrl,
                        })
                        var personalImgUrl = that.data.imgUrl
                        // 生成face_token
                        wx.request({
                            url: detect_url,
                            header: {
                                'content-type': 'application/json'
                            },
                            data: { 
                                'image': personalImgUrl,
                                'image_type': 'URL',
                                'face_field': 'quality',
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log("detect face success")
                                console.log(res)
                                console.log("error_msg: " + res.data.error_msg)
                                if(res.data.error_code == 0){
                                    var face_token = res.data.result.face_list[0].face_token,
                                        quality = res.data.result.face_list[0].quality;
                                    if (quality.blur > 0.7 || quality.illumination < 40){
                                        wx.showModal({
                                            title: '请重新上传照片',
                                            content: '照片清晰度或亮度不符合要求！',
                                        })
                                    } else {
                                        wx.request({
                                            url: config.service.setFaceInfoUrl,
                                            header: {
                                                'content-type': 'application/json'
                                            },
                                            data: {
                                                "img_url": personalImgUrl,
                                                "student_open_id": app.globalData.userInfo.openId,
                                                "face_token": face_token
                                            },
                                            method: 'POST',
                                            success: function (e) {
                                                console.log(e)
                                                if (e.data.code == 0) {
                                                    util.showSuccess('上传图片成功')
                                                    console.log("add face success")
                                                    wx.redirectTo({
                                                        url: '../studentMain/studentMain',
                                                    })
                                                } else {
                                                    console.log("未知错误")
                                                }
                                            },
                                            fail: function (e) {
                                                console.log("add face fail")
                                                console.log(e.data)
                                            }
                                        })
                                    }
                                }else if(res.data.error_code == 222202){
                                    wx.showModal({
                                        title: '请重新上传照片',
                                        content: '照片不是真人！',
                                    })
                                }else{
                                    wx.showToast({
                                        title: res.data.error_msg,
                                    })
                                }
                                
                            },
                            fail: function (res) {
                                console.log("detect face fail")
                                console.log(res.data)
                            }
                        });

                    },
                    fail: function (e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function (e) {
                console.error(e)
            }
        })
    },

    alterFaceInfo: function () {
        console.log("in alterFaceInfo")
        var that = this
        var access_token = app.globalData.access_token;
        var detect_url = "https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=" + access_token,
            update_url = "https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/update?access_token=" + access_token;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]
                that.setData({
                    file_to_upload: filePath
                });
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',
                    success: function (res) {
                        console.log(res)
                        // 这里就是要parse:)
                        res = JSON.parse(res.data)
                        that.setData({
                            imgUrl: res.data.imgUrl,
                        })
                        var personalImgUrl = that.data.imgUrl
                        // 生成face_token
                        wx.request({
                            url: detect_url,
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                'image': personalImgUrl,
                                'image_type': 'URL',
                                'face_field': 'quality',
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log("detect face success")
                                console.log(res)
                                if (res.data.error_code == 0) {
                                    var face_token = res.data.result.face_list[0].face_token,
                                        quality = res.data.result.face_list[0].quality;
                                    if (quality.blur > 0.7 && quality.illumination < 40) {
                                        wx.showModal({
                                            title: '请重新上传照片',
                                            content: '照片清晰度或亮度不符合要求！',
                                        })
                                    } else {
                                        /**
                                         * 1. 修改face表中的数据
                                         * 2. 获取学生选课的invitation_code
                                         * 3. update所有facecet
                                         */
                                        wx.request({
                                            url: config.service.alterFaceInfoUrl,
                                            header: {
                                                'content-type': 'application/json'
                                            },
                                            data: {
                                                "img_url": personalImgUrl,
                                                "student_open_id": app.globalData.userInfo.openId,
                                                "face_token": face_token
                                            },
                                            method: 'POST',
                                            success: function (e) {
                                                console.log(e)
                                                if (e.data.code == 0) {
                                                    console.log("alter face success")
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
                                                            var len = res.data.data[0].length
                                                            if (len != 0) {
                                                                for (var i = 0; i < len; i++) {
                                                                    var current_invitation_code = res.data.data[0][i].invitation_code;
                                                                    wx.request({
                                                                        url: update_url,
                                                                        method: 'POST',
                                                                        header: {
                                                                            'content-type': 'application/json'
                                                                        },
                                                                        data: {
                                                                            'image': face_token,
                                                                            'image_type': 'FACE_TOKEN',
                                                                            'user_id': that.data.student_id,
                                                                            'user_info': face_token,
                                                                            'group_id': current_invitation_code,

                                                                        },
                                                                        success: function (res) {
                                                                            console.log("update facecet success")
                                                                            console.log(res)
                                                                            if (i >= len){
                                                                                util.showSuccess('上传图片成功')
                                                                                wx.redirectTo({
                                                                                    url: '../studentMain/studentMain',
                                                                                })
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    console.log("未知错误")
                                                }
                                            },
                                            fail: function (e) {
                                                console.log("alter face fail")
                                                console.log(e.data)
                                            }
                                        })
                                    }
                                } else if (res.data.error_code == 222202) {
                                    wx.showModal({
                                        title: '请重新上传照片',
                                        content: '照片不是真人！',
                                    })
                                } else {
                                    wx.showToast({
                                        title: res.data.error_msg,
                                    })
                                }

                            },
                            fail: function (res) {
                                console.log("detect face fail")
                                console.log(res.data)
                            }
                        });

                    },
                    fail: function (e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function (e) {
                console.error(e)
            }
        })
    },

    previewImage: function (e) {
        wx.previewImage({
            urls: [this.data.user_img_url] // 需要预览的图片http链接列表
        })
    }
})