//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config.js')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    globalData: {
        userInfo: null,
        //   apiKey: 'c6933e1761c14352a3a66f0d64503da5'
        // baidu
        access_token: '24.9227b3c5e227b20bd2a0d5c5ffc34242.2592000.1528248370.282335-11200690',
        api_key: 'KExGxS1C8ED63P0bFNEk3VVR',
        secret_key: '7H2XNdyBn6M9mqVdVTiEWG7CKXN6iR4Q'
    }
})