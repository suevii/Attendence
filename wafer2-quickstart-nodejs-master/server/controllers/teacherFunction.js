const qcloud = require('../qcloud.js');

const { mysql } = qcloud
const STUDENT_TABLE = 'student'
const TEACHER_TABLE = 'teacher'
const COURSE_TABLE = 'course'
const SELECT_INFO_TABLE = 'select_info'
const ATTENDANCE_TABLE = 'attendence'
const FACE_TABLE = 'face'
module.exports = {
    // 添加教师个人信息
    addTeacher: async (ctx, next) => {
        console.log("in addTeacher");
        var teacherInfo = {
            open_id: ctx.request.body.open_id,
            name: ctx.request.body.name
        };
        var res = await mysql(TEACHER_TABLE).insert(teacherInfo);
        ctx.state.data = res;
        console.log(res);
    },
    alterTeacher: async (ctx, next) => {
        console.log("in alterTeacher");
        var open_id = ctx.request.body.open_id;
        var name = ctx.request.body.name;
        var res = await mysql(TEACHER_TABLE).where({ open_id: open_id }).update({ name: name });
        ctx.state.data = res;
        console.log(res);
    },
    // 获取教师课程列表
    getCourseList: async (ctx, next) => {
        console.log("in getCourseList");
        var teacher_open_id = ctx.request.body.open_id;
        var res = await mysql(COURSE_TABLE).select('*').where({ teacher_open_id: teacher_open_id });
        ctx.state.data = res;
        console.log(res);
    },
    // 添加课程
    addCourse: async (ctx, next) => {
        console.log("in addCourse");
        var id = ctx.request.body.id,
            teacher_open_id = ctx.request.body.teacher_open_id,
            course_name = ctx.request.body.course_name,
            date = ctx.request.body.date;
        var res1 = await mysql(COURSE_TABLE).select('*').where({ id: id, course_name: course_name, teacher_open_id: teacher_open_id });
        if (res1.length != 0){
            ctx.state.code = 100
            ctx.state.data = "课程已存在！"
        } else {
            var res2 = await mysql(COURSE_TABLE).max('course_open_id');
            var course_open_id = res2[0]['max(`course_open_id`)'] + 1;
            var invitation_code = course_open_id + date;
            var courseInfo = {
                course_open_id: course_open_id,
                id: ctx.request.body.id,
                course_name: ctx.request.body.course_name,
                teacher_open_id: ctx.request.body.teacher_open_id,
                invitation_code: invitation_code
            };
            var res = await mysql(COURSE_TABLE).insert(courseInfo);
            ctx.state.data = invitation_code;
        }
    },
    getInvitationCode: async (ctx, next) => {
        console.log("in getInvitationCode");
        var course_open_id = ctx.request.body.course_open_id;
        var res = await mysql(COURSE_TABLE).select('*').where({ course_open_id: course_open_id });
        ctx.state.data = res;
        console.log(res);
    },
    getStudentNumber: async (ctx, next) => {
        console.log("in getStudentNumber");
        var course_open_id = ctx.request.body.course_open_id;
        var res = await mysql.raw('select count(select_id) as student_number from select_info as sl where sl.course_open_id=?', [course_open_id]);
        ctx.state.data = res;
        console.log(res);
    },
    // 教师拍照识别的时候，获取face_id(列表)属于哪些学生
    getFaceOwner: async (ctx, next) => {
        console.log("in getFaceOwner:");
        var recognized_student_open_id = ctx.request.body.recognized_student_open_id;
        console.log(recognized_student_open_id)
        var student_info = [];
        for (var i = 0; i < recognized_student_open_id.length; i++) {
            // forEach 不支持await，但是不用await好像就取不到数据，所以这里就用for
            var current_student_open_id = recognized_student_open_id[i];
            console.log("current_student_open_id " + current_student_open_id)
            var current_student_info = await mysql(STUDENT_TABLE).select('face.img_url', 'student.student_id', 'student.name')
                .where({ 'student.student_open_id': current_student_open_id }).innerJoin(FACE_TABLE, 'face.student_open_id', 'student.student_open_id');
            console.log(current_student_info)
            student_info.push(current_student_info)
        }
        console.log(student_info)
        ctx.state.data = student_info;
    },

    deleteCourse: async (ctx, next) => {
        console.log("in deleteCourse");
        var course_open_id = ctx.request.body.course_open_id;
        // 此处数据库自动级联删除select_info
        var res = await mysql(COURSE_TABLE).where({ course_open_id: course_open_id }).del();
        ctx.state.data = res;
        console.log(res);
    },
    getAttendList: async (ctx, next) => {
        console.log("in getAttendList")
        var attend_date = ctx.request.body.attend_date,
            course_open_id = ctx.request.body.course_open_id,
            result = [],
            temp = [];
        var res1 = await mysql.raw('select s.student_open_id, s.student_id, s.name, f.img_url from student as s, select_info as sl, face as f where f.student_open_id = s.student_open_id and sl.course_open_id=? and s.student_open_id = sl.student_open_id ORDER BY s.student_id', [course_open_id]);
        console.log(res1)
        var res2 = await mysql.raw('select sl.student_open_id from select_info as sl left join attendence as a on sl.select_id = a.select_id where sl.course_open_id=? and a.attend_date=?', [course_open_id, attend_date]);
        console.log(res2)
        for (var i = 0; i < res2[0].length; i++) {
            var current = res2[0][i];
            temp.push(current.student_open_id)
        }
        console.log("temp:")
        console.log(temp)
        for(var i = 0; i < res1[0].length; i ++){
            var current = res1[0][i];
            if (temp.indexOf(current.student_open_id) != -1){
                current["if_attend"] = 1;
            } else {
                current["if_attend"] = 0;
            }
            result.push(current)
        }
        console.log("result")
        console.log(result)
        ctx.state.data = result;
    },
    /**
     * 1. 从select_info获取select_id
     * 2. 判断attendence表中是否已有出勤记录
     * 3. 插入出勤记录
     */
    addAttendence: async (ctx, next) => {
        console.log("in addAttendence:");
        var recognized_student_open_id = ctx.request.body.recognized_student_open_id,
            course_id = ctx.request.body.course_id,
            teacher_open_id = ctx.request.body.teacher_open_id,
            attend_date = ctx.request.body.attend_date;
        var student_info = [];
        for (var i = 0; i < recognized_student_open_id.length; i++) {
            // forEach 不支持await，但是不用await好像就取不到数据，所以这里就用for
            var current_student_open_id = recognized_student_open_id[i];
            console.log("current_student_open_id: " + current_student_open_id)
            var res1 = await mysql(SELECT_INFO_TABLE).select('select_id')
                .where({ student_open_id: current_student_open_id, teacher_open_id: teacher_open_id, course_id: course_id });
            console.log(res1)
            var select_id = res1[0].select_id
            var res2 = await mysql(ATTENDANCE_TABLE).select('*')
                .where({ select_id: select_id, attend_date: attend_date });
            console.log(res2)
            if (res2.length == 0) {
                console.log("学生出勤记录为无，插入出勤记录...")
                var attendance_info = {
                    select_id: select_id,
                    attend_date: attend_date
                }
                var res = await mysql(ATTENDANCE_TABLE).insert(attendance_info);
                ctx.state.data = res;
                console.log(res)
            }
        }
    }
}