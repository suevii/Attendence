// pages/teacher/studentAttendence/studentAttendence.js
// done
const app = getApp();
var config = require('../../../config')
var util = require('../../../utils/util.js')

Page({
    data: {
        date: '',
        course_open_id: '',
        attend_list: [],
        total_student_number: 0,
        attend_student_number: 0
    },

    onLoad: function (options) {
        var date = util.formatDate(new Date());
        this.setData({
            date: date,
            course_open_id: options.course_open_id
        });
    },

    onShow: function () {
        this.getAttendList()
    },

    dateChange: function (event) {
        this.setData({
            date: event.detail.value,
        })
        this.getAttendList()
    },

    getAttendList: function (e) {
        var that = this
        wx.request({
            url: config.service.getAttendListUrl,
            method: 'POST',
            data: {
                attend_date: that.data.date,
                course_open_id: that.data.course_open_id
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log("in getAttendList")
                console.log(res)
                if(res.data.data.length != 0){
                    var total_student_num = 0, attend_student_num = 0;
                    for (var i = 0; i < res.data.data.length; i++){
                        total_student_num ++;
                        if(res.data.data[i].if_attend == 1){
                            attend_student_num ++;
                        }
                    }
                    that.setData({
                        attend_list: res.data.data,
                        total_student_number: total_student_num,
                        attend_student_number: attend_student_num
                    })
                }
            }
        })
    },
    previewImage: function (e) {
        var img_url = e.currentTarget.dataset.url
        wx.previewImage({
            urls: [img_url] // 需要预览的图片http链接列表
        })
    }
})