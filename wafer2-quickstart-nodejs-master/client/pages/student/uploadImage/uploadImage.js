// pages/student/uploadImage/uploadImage.js
const app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var config = require('../../../config')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        files: [],
        face_uploaded: false
    },

    onShow: function () {
        this.login()
        this.getUserInfo('student')
    },


      // 用户登录示例
    login: function() {
        if (this.data.logged) return
            util.showBusy('正在登录')
        var that = this

        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
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
                            util.showSuccess('登录成功')
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

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

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
                console.log("After get " + character + "info");
                console.log(res);
                that.setData({
                    student_id: res.data.data[0].student_id,
                    student_name: res.data.data[0].name
                })
            }
        });
    },
    // testApi: function () {
    //     wx.request({
    //         url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
    //         header: {
    //             'content-type': 'application/x-www-form-urlencoded'
    //         },
    //         data: {
    //             'api_key': '1uffrQ5a_AWZjvrJU78jaJXdq1q9sz4y',
    //             'api_secret': 'tAogyB4HmvES-M7A4oWPWot89eD6Bj49',
    //             'image_url': 'https://qcloudtest-1256133326.cos.ap-guangzhou.myqcloud.com/1520416251630-ByEZLN6uM.jpg',
    //             'return_attributes': 'gender',
    //             'return_landmark': 2
    //         },
    //         method: 'POST',
    //         success: function (res) {
    //             console.log(res.data)
    //             console.log(res.data.faces[0].attributes.gender.value)
    //             wx.showToast({
    //                 title: '性别: ' + res.data.faces[0].attributes.gender.value,
    //             })
    //         }
    //     });
    // },


    testApi: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                util.showBusy('正在调用API');
                console.log(res.tempFilePaths);
                console.log(res.tempFiles);
                var filePath = res.tempFilePaths[0];
                wx.request({
                    url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        'api_key': '1uffrQ5a_AWZjvrJU78jaJXdq1q9sz4y',
                        'api_secret': 'tAogyB4HmvES-M7A4oWPWot89eD6Bj49',
                        // 'image_file': filePath,
                        'image_url': 'https://qcloudtest-1256133326.cos.ap-guangzhou.myqcloud.com/1520416251630-ByEZLN6uM.jpg',
                        'return_attributes': 'gender', 
                        'return_landmark': 2
                    },
                    method: 'POST',
                    success: function(res) {
                        console.log(res.data)
                        console.log(res.data.faces[0].attributes.gender.value)
                        wx.showToast({
                            title: '性别: ' + res.data.faces[0].attributes.gender.value,
                        })
                    }
                });
            }
        })
    },
    // 上传图片接口
    doUpload: function () {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',
                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                        console.log("imgUrl: " + that.data.imgUrl)
                        wx.request({
                            url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                'api_key': '1uffrQ5a_AWZjvrJU78jaJXdq1q9sz4y',
                                'api_secret': 'tAogyB4HmvES-M7A4oWPWot89eD6Bj49',
                                // 'image_file': filePath,
                                'image_url': that.data.imgUrl,
                                'return_attributes': 'gender',
                                'return_landmark': 2
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log(res.data)
                                console.log(res.data.faces[0].attributes.gender.value)
                                wx.showToast({
                                    title: '性别: ' + res.data.faces[0].attributes.gender.value,
                                })
                            }
                        });
                    },
                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },
    detectFace: function () {
        var that = this
        var detect_url = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false';
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

                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',
                    success: function (res) {
                        console.log(res)
                        // 这里就是要parse:)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl,
                        })
                        console.log("imgUrl: " + that.data.imgUrl)
                        var detectImg = that.data.imgUrl
                        // detect API
                        wx.request({
                            url: detect_url,
                            header: {
                                'content-type': 'application/json',
                                'Ocp-Apim-Subscription-Key': 'fcb814dfa34c42199617c5f37bef5568'
                            },
                            data: {
                                'url': detectImg
                            },
                            method: 'POST',
                            success: function (res) {
                                util.showSuccess('上传图片成功')
                                console.log("res.data:")
                                console.log(res.data)
                                var face_id = res.data[0].faceId;
                                console.log("前端的face_id")
                                console.log(face_id)
                                wx.request({
                                    url: config.service.addFaceUrl,
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    data: {
                                        "face_id": face_id,
                                        "student_open_id": app.globalData.userInfo.openId
                                    },
                                    method: 'POST',
                                    success: function(e) {
                                        if (e.data.code == 0){
                                            util.showSuccess('上传图片成功')
                                            console.log("add face success")
                                            console.log(e.data)
                                        }else{
                                            if(e.data.error.indexOf('Duplicate entry') != -1){
                                                console.log("用户照片已存在")
                                                that.openReplaceFaceConfirm();
                                            }else
                                            console.log("未知错误")
                                        }
                                    },
                                    fail: function(e) {
                                        console.log("add face fail")
                                        console.log(e.data)
                                    }
                                });
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
    openReplaceFaceConfirm: function () {
        wx.showModal({
            title: '用户照片已存在',
            content: '是否替换已有照片？',
            confirmText: "是",
            cancelText: "否",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    console.log('替换')
                } else {
                    console.log('不替换')
                }
            }
        });
    },
    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    getUsername: function (e) {
        this.setData({
        username: e.detail.value
        })
    },
  getPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log(e.detail.value.student_id + e.detail.value.student_name)
    if (e.detail.value.student_id == "" || e.detail.value.student_name == ""){
      util.showModel('无法提交','请填写完整信息');
    }
    else{
      util.showBusy('正在提交');
      wx.request({
        url: 'http://127.0.0.1:5757/sinsert',
        data: {
          person_one: app.globalData.person_one,
          person_two: app.globalData.person_two,
          team_name: e.detail.value.team_name,
          team_state: e.detail.value.team_state + e.detail.value.present_num,
          rule_1: e.detail.value.rule_1,
          rule_2: e.detail.value.rule_2,
          rule_3: e.detail.value.rule_3,
          rule_4: e.detail.value.rule_4,
          rule_5: e.detail.value.rule_5,
          rule_6: e.detail.value.rule_6,
          rule_7: e.detail.value.rule_7,
          rule_8: e.detail.value.rule_8,
          rule_9: e.detail.value.rule_9,
        },
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
    
  },
  formReset: function () {
    console.log('form发生了reset事件')
    util.showSuccess('重置成功');
  }
})