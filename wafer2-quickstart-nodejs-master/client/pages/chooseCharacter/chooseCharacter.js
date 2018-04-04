// pages/chooseCharacter/chooseCharacter.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var util = require('../../utils/util.js')
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
  },

  onShow: function () {
    this.login()
  },

  getUserCharacter: function (e) {
    var that = this
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
          console.log("User hasn't chosen character yet!")
        else {
          // util.showBusy('正在跳转')
          var if_teacher = res.data.data[0].if_teacher;
          console.log("if_teacher?: " + if_teacher)
          if (if_teacher == 1) {
            console.log("User is teacher");
            wx.redirectTo({
              url: '../teacher/teacherMain/teacherMain',
            });
          } else {
            console.log("User is student");
            wx.redirectTo({
              url: '../student/uploadImage/uploadImage',
            });
          }
          // util.showSuccess('获取if_teacher成功');
        }
        
      }
    });
  },
  // 用户登录示例
  login: function () {
    if (this.data.logged) return
      util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('首次登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
          console.log("首次的userInfo: ")
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
              console.log(result)
              console.log(result.data)
              console.log("login")
              console.log(result.data.data)
              that.getUserCharacter();
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
          
          console.log(that.data.userInfo)
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },

  studentUser: function (e) {

  },

  teacherUser: function (e) {
    wx.redirectTo({
      url: '../teacher/login/login',
    })
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