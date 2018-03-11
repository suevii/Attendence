// pages/chooseCharacter/chooseCharacter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  studentUser: function (e) {

  },

  teacherUser: function (e) {
    wx.redirectTo({
      url: '../teacher/login/login',
    })
  }
})