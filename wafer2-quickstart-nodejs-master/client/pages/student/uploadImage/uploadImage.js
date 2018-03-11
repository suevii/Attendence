// pages/student/uploadImage/uploadImage.js
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
        requestResult: ''
    },

      // 用户登录示例
    login: function() {
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

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

  // 上传图片接口
  doUpload: function () {
      var that = this

      // 选择图片
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function(res){
              util.showBusy('正在上传')
              var filePath = res.tempFilePaths[0]

              // 上传图片
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
  // 预览图片
  previewImg: function () {
      wx.previewImage({
          current: this.data.imgUrl,
          urls: [this.data.imgUrl]
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

})