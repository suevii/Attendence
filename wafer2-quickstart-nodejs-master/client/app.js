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
        access_token: '24.c11b0e36b986340f45ca17ed8ce8560e.2592000.1529212365.282335-11200690',
        api_key: 'KExGxS1C8ED63P0bFNEk3VVR',
        secret_key: '7H2XNdyBn6M9mqVdVTiEWG7CKXN6iR4Q'
    }
})