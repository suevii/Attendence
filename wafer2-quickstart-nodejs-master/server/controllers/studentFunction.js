const qcloud = require('../qcloud.js');

const { mysql } = qcloud

const STUDENT_TABLE = 'student';
const COURSE_TABLE = 'course';
const TEACHER_TABLE = 'teacher';
const SELECT_INFO_TABLE = 'select_info'
const FACE_TABLE = 'face'
module.exports = {
    // setStudentInfo
    addStudent: async (ctx, next) => {
        console.log("in addStudent");
        var studentInfo = {
            student_open_id: ctx.request.body.student_open_id,
            name: ctx.request.body.name,
            student_id: ctx.request.body.student_id
        };
        var res = await mysql(STUDENT_TABLE).insert(studentInfo);
        ctx.state.data = res;
        console.log(res);
    },
    alterStudent: async (ctx, next) => {
        console.log("in alterStudent");
        var student_open_id = ctx.request.body.student_open_id,
            name = ctx.request.body.name,
            student_id = ctx.request.body.student_id;
        var res = await mysql(STUDENT_TABLE).where({ student_open_id: student_open_id }).update({ name: name, student_id: student_id });
        ctx.state.data = res;
        console.log(res);
    },
    // 我的-个人照片-已提交/未提交
    getFaceInfo: async (ctx, next) => {
        console.log("in getFaceInfo")
        var student_open_id = ctx.request.body.student_open_id;
        var res = await mysql(FACE_TABLE).select('*').where({ student_open_id: student_open_id });
        ctx.state.data = res;
        console.log(res);
    },
    // 我的-提交照片
    setFaceInfo: async (ctx, next) => {
        console.log("in setFaceInfo")
        var student_open_id = ctx.request.body.student_open_id,
            img_url = ctx.request.body.img_url,
            face_token = ctx.request.body.face_token;
        var res;
        var res1 = await mysql(FACE_TABLE).select('*').where({ student_open_id: student_open_id });
        console.log(res1)
        if (res1.length != 0) {
            console.log("Student face info already exists, going to update...")
            // res = await mysql(table_name).where({ student_open_id: student_open_id }).update({ img_url: img_url });
            res = await mysql(FACE_TABLE).where({ student_open_id: student_open_id }).update({ img_url: img_url, face_token: face_token });
        } else {
            console.log("Student hasn't face info, going to insert...")
            var face_info = {
                student_open_id: student_open_id,
                img_url: img_url,
                face_token: face_token
            }
            res = await mysql(FACE_TABLE).insert(face_info);
        }
        ctx.state.data = res;
        console.log(res);
    },
    
    // 我的-提交照片
    addFace: async (ctx, next) => {
        console.log("in addFace")
        var face_info = {
            student_open_id: ctx.request.body.student_open_id,
            face_id: ctx.request.body.face_id
        }
        var res = await mysql(FACE_TABLE).insert(face_info);
        ctx.state.data = res;
        console.log(res);
    },
    // 我的-我的课程
    getStudentCourseList: async (ctx, next) => {
        console.log("in getStudentCourseList");
        // var table_name = 'select_info';
        var student_open_id = ctx.request.body.student_open_id;
        // var res = await mysql(table_name).select('*').where({ student_id: student_id });
        var res = await mysql.raw('select c.course_name as course_name, t.name as teacher_name from course as c, teacher as t, select_info as sl where sl.student_open_id = ? and sl.course_id = c.id and sl.teacher_open_id = t.open_id', [student_open_id]);
        ctx.state.data = res;
        console.log(res);
    },
    addStudentToCourse: async (ctx, next) => {

    },
    /*
        1. 查找邀请码对应课程
        2. 判断学生是否已加入课程
            2-1. 若加入过：提示已加入；
            2-2. 若未加入过：返回课程信息
    */
    searchCode: async (ctx, next) => {
        console.log("in searchCode");
        var invitation_code = ctx.request.body.invitation_code,
            student_open_id = ctx.request.body.student_open_id;
        var res1 = await mysql(COURSE_TABLE).select('*').where({ invitation_code: invitation_code });
        console.log(res1)
        if (res1.length == 0){
            ctx.state.code = 100
            ctx.state.data = "未找到与邀请码匹配的课程"
        } else {
            // 判断是否已加入过课程
            var teacher_open_id = res1[0].teacher_open_id,
                course_id = res1[0].id;
            var res2 = await mysql(SELECT_INFO_TABLE).select('*')
                        .where({ teacher_open_id: teacher_open_id, student_open_id: student_open_id, course_id, course_id})
            if (res2.length == 0){
                var res3 = await mysql(COURSE_TABLE).select('course.id', 'course.course_name', 'teacher.name', 'course.teacher_open_id')
                            .where({ invitation_code: invitation_code })
                            .innerJoin(TEACHER_TABLE, 'course.teacher_open_id', 'teacher.open_id');
                console.log(res3)
                ctx.state.data = res3;
            } else {
                // 已加入过课程
                ctx.state.code = 101
                ctx.state.data = "已加入过该课程！"
            }
            
        }
    },

    // 我的-我的课程-添加课程
    addStudentToCourse: async (ctx, next) => {
        console.log("in addStudentToCourse");
        var select_info = {
            student_open_id: ctx.request.body.student_open_id,
            course_id: ctx.request.body.course_id,
            teacher_open_id: ctx.request.body.teacher_open_id
        }
        var res = await mysql(SELECT_INFO_TABLE).insert(select_info);
        console.log(res)
        ctx.state.data = res;
    },
    // // 我的-我的课程-添加课程
    // addStudentToCourse_backup: async (ctx, next) => {
    //     console.log("in addStudentToCourse");
    //     var select_info = {
    //         student_open_id: ctx.request.body.student_open_id,
    //         course_id: ctx.request.body.course_id,
    //         teacher_open_id: ctx.request.body.teacher_open_id,
    //         persisted_face_id: ctx.request.body.persisted_face_id
    //     }
    //     var res = await mysql(SELECT_INFO_TABLE).insert(select_info);
    //     console.log(res)
    //     ctx.state.data = res;
    // }
}