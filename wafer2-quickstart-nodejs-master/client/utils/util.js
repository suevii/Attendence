
var Api = require('./api.js')

//获取code
var getCode = function (callback) {
  wx.login({
    success: function (res) {
      if (res.code) {
        typeof callback === "function" && callback(res.code)
      }
      else {
        console.log('获取code失败！' + res.errMsg)
      }
    }
  })
}

// 获取access_token
function getToken(callback) {
  getCode((code) => {
    wx.getUserInfo({
      success: function (res) {
        console.log('用户允许授权')
        wx.request({
          url: Api.session,
          data: {
            code: code,
            newteo: 'b1efdafd3bbec0b7251c755859d6d9e5f073263c',
            iv: res.iv,
            encryptedData: res.encryptedData
          },
          method: 'GET',
          success: function (res) {
            typeof callback == "function" && callback(res.data)
          },
          fail: function () {
            console.log('wx.request 请求失败')
          }
        })
      },
      fail: function (res) {
        if (res.errMsg) {
          console.log('用户拒绝授权', res)
          typeof callback == "function" && callback({ errMsg: "userDenyed" })
        }
      }
    })
  })
}


var translateMonth = function (month) {
  month = month * 1 + 1
  if (month < 10) {
    return month = '0' + month
  }
  else return month = month + ''
}

var translateWeek = function (week) {
  switch (week) {
    case 0:
      return '星期日';
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
    default:
  }
}


function loadStaffDate(value, id, callback) {
  var newdate = new Date(value);
  var month;
  if (newdate.getMonth() < 10) {
    month = '0' + (newdate.getMonth() + 1)
  }
  wx.request({
    url: Api.staffsigns + id,
    data: {
      today: newdate.getFullYear() + '-' + month,
      token: wx.getStorageSync('token')
    },
    method: 'GET',
    success: (res) => {
      //服务器返回的员工某月的打卡纪录
      console.log(res)
      typeof callback == "function" && callback(newdate.getDay(), res)
    },
    fail: function (fail) {
      console.log(fail)
    },
  })
}
function obtainIndate(cb) {
  var obtainInday = new Date()
  obtainInday.setMonth(obtainInday.getMonth() + 1)
  var month = obtainInday.getMonth(), day = obtainInday.getDate()
  if (month < 10)
    month = '0' + month
  if (day < 10)
    day = '0' + day
  typeof cb == "function" && cb(obtainInday.getFullYear()
    + '-' + month
    + '-' + day)
}

var checkToken = function (token, cb) {
  wx.request({
    url: Api.userInfo + token,
    data: {},
    method: 'GET',
    success: function (res) {
      // success
      if (res.statusCode == 200) {
        console.log('token有效')
        typeof cb == 'function' && cb('good')
      }
      else {
        console.log('token无效')
        typeof cb == 'function' && cb('invail')
      }

    }
  })
}


module.exports = {
  getToken: getToken,
  checkToken: checkToken,
  translateMonth: translateMonth,
  translateWeek: translateWeek,
  loadStaffDate: loadStaffDate,
  obtainIndate: obtainIndate,
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 自己写的
const generateNumber = date => {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString()
    const hour = date.getHours().toString()
    const minute = date.getMinutes().toString()
    const second = date.getSeconds().toString()

    return year + month + day + hour + minute + second
}
// 自己写的
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

var showFailure = text => wx.showToast({
    title: text,
    icon: 'none'
})


// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title: title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

module.exports = { formatTime, formatDate, showBusy, showSuccess, showFailure, showModel, generateNumber }
