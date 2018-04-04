// pages/teacher/studentAttendence/studentAttendence.js
var config = require('../../../config')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = util.formatDate(new Date());
    console.log("date:")
    console.log(date)
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      date: date
    });  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getStudentAttendence()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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
        attend_date: that.data.date
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        console.log("res.data: " + res.data)
        console.log("res.data.data: " + res.data.data)
        //var arr = JSON.parse(res.data)
        that.setData({
          lists: res.data.data
        });
        console.log("lists: " + that.data.lists)
        //util.showSuccess('提交成功');
      }
    })
  }
})