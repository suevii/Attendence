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

        // 公共
        setUserCharacterUrl: `${host}/weapp/setUserCharacter`,
        getUserCharacterUrl: `${host}/weapp/getUserCharacter`,
        getUserInfoUrl: `${host}/weapp/getUserInfo`,

        // addCourse
        addCourseUrl: `${host}/weapp/addCourse`,

        
        getFaceInfoUrl: `${host}/weapp/getFaceInfo`,
        
        
        
        getStudentUrl: `${host}/weapp/getStudent`,
        getTeacherUrl: `${host}/weapp/getTeacher`,
        // 教师
        getCourseListUrl: `${host}/weapp/getCourseList`,
        getAttendListUrl: `${host}/weapp/getAttendList`,
        addTeacherUrl: `${host}/weapp/addTeacher`,
        alterTeacherUrl: `${host}/weapp/alterTeacher`,

        getInvitationCodeUrl: `${host}/weapp/getInvitationCode`,
        getStudentNumberUrl: `${host}/weapp/getStudentNumber`,
        deleteCourseUrl: `${host}/weapp/deleteCourse`,
        
        
        
        

        

        

        getFaceOwnerUrl: `${host}/weapp/getFaceOwner`,
        // 学生
        addStudentUrl: `${host}/weapp/addStudent`,
        alterStudentUrl: `${host}/weapp/alterStudent`,
        addFaceUrl: `${host}/weapp/addFace`,
        addImgUrlUrl: `${host}/weapp/addImgUrl`,
        setFaceInfoUrl: `${host}/weapp/setFaceInfo`,
        alterFaceInfoUrl: `${host}/weapp/alterFaceInfo`,
        getStudentCourseListUrl: `${host}/weapp/getStudentCourseList`,
        getStudentAttendDateUrl: `${host}/weapp/getStudentAttendDate`,
        searchCodeUrl: `${host}/weapp/searchCode`,
        addStudentToCourseUrl: `${host}/weapp/addStudentToCourse`,

        addAttendenceUrl: `${host}/weapp/addAttendence`,

        testUrl: `${host}/weapp/sinsert`
    }
};

module.exports = config;
