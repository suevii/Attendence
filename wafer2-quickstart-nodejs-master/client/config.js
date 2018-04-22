/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://i2amuqdc.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        // addCourse
        addCourseUrl: `${host}/weapp/addCourse`,

        getUserInfoUrl: `${host}/weapp/getUserInfo`,
        
        addTeacherUrl: `${host}/weapp/addTeacher`,
        addStudentUrl: `${host}/weapp/addStudent`,
        getStudentUrl: `${host}/weapp/getStudent`,
        
        getCourseListUrl: `${host}/weapp/getCourseList`,

        getStudentAttendenceUrl: `${host}/weapp/getStudentAttendence`,

        getUserCharacterUrl: `${host}/weapp/getUserCharacter`,

        setUserCharacterUrl: `${host}/weapp/setUserCharacter`,

        getFaceOwnerUrl: `${host}/weapp/getFaceOwner`,

        addFaceUrl: `${host}/weapp/addFace`,

        testUrl: `${host}/weapp/sinsert`
    }
};

module.exports = config;
