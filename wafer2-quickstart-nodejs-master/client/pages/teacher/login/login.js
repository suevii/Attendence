const util = require('../../../utils/util');
const app = getApp();
Page({

  // 页面的初始数据
  data: {
    password: null,
    username: null
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
      app.globalData.userInfo = {
        username: this.data.username,
        password: this.data.password
      }
      wx.redirectTo({
        url: '../teacherMain/teacherMain',
      })
    } else {
      // util.showModel('登录失败','账户或密码错误');
      util.showFailure('登录失败');
      
      app.globalData.userInfo = null
      console.info("app.globalData.userInfo: " + app.globalData.userInfo)
      
      // 这个人干嘛要设成这样？？？
      // this.setData({
      //   username: app.globalData.userInfo.username
      // })
    } 
  }
})