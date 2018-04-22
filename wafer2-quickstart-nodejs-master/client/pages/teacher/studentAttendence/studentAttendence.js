// pages/teacher/studentAttendence/studentAttendence.js
const app = getApp();
var config = require('../../../config')
var util = require('../../../utils/util.js')

Page({

    data: {
        lists: [],
        date: ''
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
        this.getStudentAttendence()
    },

    dateChange: function (event) {
        console.log(event.detail.value)
        this.setData({
            date: event.detail.value,
        })
        this.getStudentAttendence()
    },

    getStudentAttendence: function(e) {
        var that = this
        wx.request({
            url: config.service.getStudentAttendenceUrl,
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
                console.log(res)
                // console.log("res.data: " + res.data)
                // console.log("res.data.data: " + res.data.data)
                //var arr = JSON.parse(res.data)
                that.setData({
                    lists: res.data.data[0]       //这里用[0]是因为后端用的knex.raw，返回值是个数组（我也不知道为啥）
                });
                console.log("lists: " + that.data.lists)
                //util.showSuccess('提交成功');
            }
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
    doRecognition: function (e) {
        var that = this;
        var detect_url = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false';
        var find_similar_url = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/findsimilars';
        
        var face_id_array = [];             // detect返回值
        var persisted_face_id_array = [];   // findSimilar返回值
        
        // 1. call detect API
        wx.request({
            url: detect_url,
            header: {
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': 'fcb814dfa34c42199617c5f37bef5568'
            },
            data: {
                'url': 'https://qcloudtest-1256133326.cos.ap-guangzhou.myqcloud.com/test/hezhao.jpg'
            },
            method: 'POST',
            success: function (res) {
                console.log(res.data)
                that.setData({
                    face: res.data
                });
                console.log(that.data.face)
                
                that.data.face.forEach(function (item, index) {
                    // console.log(item.faceId + '---' + index);
                    console.log("item.faceId: " + item.faceId);
                    var current_face_id = item.faceId
                    // 2. call find similar API
                    wx.request({
                        url: find_similar_url,
                        header: {
                            'content-type': 'application/json',
                            'Ocp-Apim-Subscription-Key': 'fcb814dfa34c42199617c5f37bef5568'
                        },
                        data: {
                            "faceId": current_face_id,
                            "faceListId": "list4",
                            "maxNumOfCandidatesReturned": 10,
                            "mode": "matchPerson"
                        },
                        method: 'POST',
                        success: function (res) {
                            console.log("in find similar face")
                            console.log(res.data)
                            if(res.data.length != 0){
                                var persisted_face_id = res.data[0].persistedFaceId;
                                persisted_face_id_array.push(persisted_face_id);
                                that.setData({
                                    persisted_face_id: persisted_face_id_array
                                })
                                // if (persisted_face_id == 'fb7976c2-14ab-44b8-9dee-7f59f8598866')
                                //     console.log("我是白展堂");
                                // 先试下一个个去数据库找
                                wx.request({
                                    url: config.service.getFaceOwnerUrl,
                                    header: {
                                        'content-type': 'application/json',
                                    },
                                    data: {
                                        face_id: persisted_face_id
                                    },
                                    method: 'POST',
                                    success: function (res) {
                                        console.log("in get owner")
                                        console.log(res.data)
                                        
                                        console.log("我是" + res.data.data[0].name)
                                    }
                                })
                            }
                            // console.log("that.data.persisted_face_id in promise: ")
                            // console.log(that.data.persisted_face_id)
                        }
                    })
                face_id_array.push(item.faceId);
                });
            console.log("face_id_array:")
            console.log(face_id_array)
            }
        })

        // 3. search who owns the face_id in database
        // setTimeout(function (e) {
        //         console.log("that.data.persisted_face_id in promise: ")
        //         console.log(that.data.persisted_face_id)
        // },5000)
    },
    doRecognition2: function(e){
        var promise = new Promise(function(resolve){
            console.log("in promise")
            resolve()
        })
        promise.then(function(){
            console.log("in then")
        })
    }
})