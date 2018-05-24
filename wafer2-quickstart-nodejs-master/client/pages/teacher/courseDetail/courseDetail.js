// pages/teacher/courseDetail/courseDetail.js
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var config = require('../../../config')
Page({

    data: {
        course_open_id: '',
        course_id: '',
        course_name: '',
        invitation_code: '',
        student_number: 0,
        files: [],
        imgUrl: '',
        face_list_created: false
    },

    onLoad: function (options) {
        this.setData({
            course_open_id: options.course_open_id,
            course_id: options.course_id,
            course_name: options.course_name,
        });
        this.getInitData();
        console.log("course_id: " + this.data.course_id)
        console.log("course_name: " + this.data.course_name)
    },

    onShow: function () {
        this.setData({
            files: []
        })
    },

    getInitData: function () {
        // 1. get invitation code
        // 2. get student number
        var that = this
        console.log("in getInvitationCode...");
        wx.request({
            url: config.service.getInvitationCodeUrl,
            method: 'POST',
            data: {
                course_open_id: that.data.course_open_id
                // course_id: that.data.course_id,
                // course_name: that.data.course_name,
                // teacher_open_id: app.globalData.userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                that.setData({
                    invitation_code: res.data.data[0].invitation_code,
                    course_open_id: res.data.data[0].course_open_id
                })
                that.getStudentNumber();
            }
        });
    },
    getStudentNumber: function(e){
        console.log("in getStudentNumber...");
        var that = this
        wx.request({
            url: config.service.getStudentNumberUrl,
            method: 'POST',
            data: {
                course_open_id: that.data.course_open_id
                //course_id: that.data.course_id,
                //teacher_open_id: app.globalData.userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                that.setData({
                    student_number: res.data.data[0][0].student_number
                })
            }
        });
    },
    showInvitationCodeHint: function() {
        var that = this;
        wx.showModal({
            content: '分享邀请码，让学生加入课程吧！',
            cancelText: "知道了",
            confirmText: "复制",
            success: function (res) {
                if (res.confirm) {
                    wx.setClipboardData({
                        data: that.data.invitation_code,
                        success: function (res) {
                            wx.showToast({
                                title: '邀请码已复制！',
                                duration: 2000,
                                success: function (){
                                    wx.getClipboardData({
                                        success: function (res) {
                                            console.log("剪贴板内容")
                                            console.log(res.data) // data
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        });
    },
    
    doRecognition: function (e) {
        console.log("in doRecognition...")
        var that = this;
        var access_token = app.globalData.access_token;
        var detect_url = 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + access_token,
            search_url = 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + access_token;

        var face_id_array = [],             // detect返回值
            recognized_student_open_id = [];   // 识别出的学生名单

        var count = 0;  // 计数识别到第几个

        // Step1. chooseImage
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
                // Step2. uploadFile获取imgUrl
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',
                    success: function (res) {
                        console.log(res)
                        res = JSON.parse(res.data)  // 这里就是要parse:)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl,
                        })
                        console.log("imgUrl: " + that.data.imgUrl)
                        var detect_img_url = that.data.imgUrl
                        //Step3. detect API, 获取合照中的face_token
                        wx.request({
                            url: detect_url,
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                'image': detect_img_url,
                                'image_type': 'URL',
                                'max_face_num': 10
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log("step3")
                                console.log(res)
                                if (res.data.error_code == 0 && res.data.result.face_list.length != 0){
                                    var face_list = res.data.result.face_list
                                    console.log(face_list)
                                    console.log("开始一个个识别！")
                                    for(var i = 0; i < face_list.length; i ++){
                                        (function () { // j = i
                                            var j = i;
                                            setTimeout(function () {
                                                var current_face_token = face_list[j].face_token
                                                wx.request({
                                                    url: search_url,
                                                    header: {
                                                        'content-type': 'application/json'
                                                    },
                                                    data: {
                                                        "image": current_face_token,
                                                        "image_type": 'FACE_TOKEN',
                                                        "group_id_list": that.data.invitation_code,
                                                        "liveness_control": 'LOW'
                                                    },
                                                    method: 'POST',
                                                    success: function (res) {
                                                        console.log("in search")
                                                        console.log(res)
                                                        if (res.data.error_code == 0) {
                                                            if (res.data.result.user_list[0].score >= 70) {
                                                                console.log("识别出了！我的open_id是：" + res.data.result.user_list[0].user_info)
                                                                recognized_student_open_id.push(res.data.result.user_list[0].user_info);
                                                            }
                                                        }
                                                        console.log("recognized_student:")
                                                        console.log(recognized_student_open_id)
                                                        count++;
                                                        console.log("count: " + count);
                                                        console.log("length:" + face_list.length)
                                                        if (count == face_list.length) {
                                                            console.log("最后一个")
                                                            wx.navigateTo({
                                                                url: '../confirmAttendence/confirmAttendence?photo_url=' + detect_img_url + '&course_id=' + that.data.course_id + '&recognized_student_open_id=' + JSON.stringify(recognized_student_open_id),
                                                            })
                                                        }
                                                    }
                                                })
                                            }, 600 * j)
                                        })()
                                    }                               
                                }
                            }
                        })
                    }
                });
            },
        });
    },

    deleteCourse: function(){
        var that = this
        var access_token = app.globalData.access_token;
        var delete_face_group_url = "https://aip.baidubce.com/rest/2.0/face/v3/faceset/group/delete?access_token=" + access_token;
        wx.showModal({
            title: '确定删除课程？',
            content: '课程信息、学生选课记录将会消失!',
            confirmText: "确定删除",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    wx.request({
                        url: config.service.deleteCourseUrl,
                        method: 'DELETE',
                        data: {
                            course_open_id: that.data.course_open_id
                            // course_id: that.data.course_id,
                            // teacher_open_id: app.globalData.userInfo.openId
                        },
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            console.log("After deleteCourse");
                            console.log(res);
                            // delete faceList
                            if(res.data.code == 0){
                                wx.request({
                                    url: delete_face_group_url,
                                    method: 'POST',
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    data: {
                                        'group_id': that.data.invitation_code
                                    },
                                    success: function (res) {
                                        console.log("删除face group成功");
                                        console.log(res);
                                        wx.showToast({
                                            title: '正在删除',
                                            icon: 'loading',
                                            duration: 2000
                                        });
                                        wx.redirectTo({
                                            url: '../teacherMain/teacherMain',
                                        })
                                    }
                                });
                            }else{
                                console.log("删除课程失败")
                            }
                            
                        }
                    });
                } else {
                    console.log('取消删除课程')
                }
            }
        });
    }
})