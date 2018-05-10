/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

//router.get('/demo', controllers.demo)
router.post('/sinsert', controllers.mysql.sinsert)

// 公共
router.post('/setUserCharacter', controllers.mysql.setUserCharacter)
router.post('/getUserCharacter', controllers.mysql.getUserCharacter)
router.post('/getUserInfo', controllers.mysql.getUserInfo)
// 教师端
router.post('/addTeacher', controllers.teacherFunction.addTeacher)
router.post('/alterTeacher', controllers.teacherFunction.alterTeacher)
router.post('/getCourseList', controllers.teacherFunction.getCourseList)
router.post('/addCourse', controllers.teacherFunction.addCourse)
router.post('/getInvitationCode', controllers.teacherFunction.getInvitationCode)

router.post('/getStudentNumber', controllers.teacherFunction.getStudentNumber)

router.post('/getStudent', controllers.mysql.getStudent)
// router.post('/getTeacher', controllers.mysql.getTeacher)
router.post('/getFaceOwner', controllers.teacherFunction.getFaceOwner)
router.delete('/deleteCourse', controllers.teacherFunction.deleteCourse)
router.post('/addAttendence', controllers.teacherFunction.addAttendence)
router.post('/getAttendList', controllers.teacherFunction.getAttendList)
// 学生端
router.post('/addStudent', controllers.studentFunction.addStudent)
router.post('/alterStudent', controllers.studentFunction.alterStudent)
router.post('/getFaceInfo', controllers.studentFunction.getFaceInfo)
router.post('/searchCode', controllers.studentFunction.searchCode)
router.post('/addStudentToCourse', controllers.studentFunction.addStudentToCourse)
router.post('/getStudentCourseList', controllers.studentFunction.getStudentCourseList)
router.post('/addFace', controllers.studentFunction.addFace)
// router.post('/addImgUrl', controllers.studentFunction.addImgUrl)
router.post('/setFaceInfo', controllers.studentFunction.setFaceInfo)

















module.exports = router
