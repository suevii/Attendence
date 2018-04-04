const util = require('../../../utils/util');
const app = getApp();
Page({

  // 页面的初始数据
  data: {
    userInfo: {},
    logged: false,
    password: null,
    username: null
  },

  onShow: function () {
    // this.login()
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
  loginClick: function (e) {
    if (this.data.username == 'admin' && this.data.password == 'admin') {
      util.showSuccess('登录成功');
      // userInfo是个object，它有username和password
      // app.globalData.userInfo = {
      //   username: this.data.username,
      //   password: this.data.password
      // }
      wx.reLaunch({
        url: '../teacherMain/teacherMain',
      })
    } else {
      // util.showModel('登录失败','账户或密码错误');
      util.showFailure('登录失败');
      
      //app.globalData.userInfo = null
      //console.info("app.globalData.userInfo: " + app.globalData.userInfo)
      
      // 这个人干嘛要设成这样？？？
      // this.setData({
      //   username: app.globalData.userInfo.username
      // })
    } 
  }
})