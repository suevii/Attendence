const qcloud = require('../qcloud.js');

const { mysql } = qcloud
module.exports = {
	sinsert: async (ctx, next) => {
        var res = await mysql('student').select('*');
		ctx.state.data = res;
		console.log("res: " + res);
 		// var res = await mysql('student').select('*').returning('*');
 		// 	//ctx.state.data = res;
 		// 	console.log("res: " + res);
        // await mysql('student').select('*').returning('*').then(function (res) {
        // 	console.log(res);
        // 	//ctx.state.data = res;
        // });
    },
    getUserCharacter: async (ctx, next) => {
        console.log("in getUserCharacter");
        var table_name = 'userInfo';
        let open_id = ctx.request.body.open_id;
        var res = await mysql(table_name).select('*').where({ open_id: open_id });
        ctx.state.data = res;
        console.log(res);
    },
    setUserCharacter: async (ctx, next) => {
        console.log("in setUserCharacter");
        var table_name = 'userInfo';
        var userInfo = {
            open_id: ctx.request.body.open_id,
            if_teacher: ctx.request.body.if_teacher
        };
        var res = await mysql(table_name).insert(userInfo);
        ctx.state.data = res;
        console.log(res);
    },
    getUserInfo: async (ctx, next) => {
        //table_name = 'student' or 'teacher'
        console.log("in getUserInfo");
        var table_name = ctx.request.body.table_name;
        var open_id = ctx.request.body.open_id;
        var res;
        if (table_name == 'teacher')
            res = await mysql(table_name).select('*').where({ open_id: open_id });
        else 
            res = await mysql(table_name).select('*').where({ student_open_id: open_id });
        ctx.state.data = res;
        console.log(res);
    },
    getStudent: async (ctx, next) => {
        console.log("in getStudent");
        var table_name = 'student';
        var student_open_id = ctx.request.body.student_open_id;
        console.log("student_open_id: " + student_open_id)
        var res = await mysql(table_name).select('*').where({ student_open_id: student_open_id });
        ctx.state.data = res;
        console.log(res);
    },
    addStudent: async (ctx, next) => {
        console.log("in addStudent");
        var table_name = 'student';
        var studentInfo = {
            student_open_id: ctx.request.body.student_open_id,
            name: ctx.request.body.name,
            student_id: ctx.request.body.student_id
        };
        var res = await mysql(table_name).insert(studentInfo);
        ctx.state.data = res;
        console.log(res);
    },
    addTeacher: async (ctx, next) => {
        console.log("in addTeacher");
        var table_name = 'teacher';
        var teacherInfo = {
            open_id: ctx.request.body.open_id,
            name: ctx.request.body.name
        };
        var res = await mysql(table_name).insert(teacherInfo);
        ctx.state.data = res;
        console.log(res);
    },
    addCourse: async (ctx, next) => {
        console.log("in addCourse");
        var table_name = 'course';
        var courseInfo = {
            id: ctx.request.body.id,
            name: ctx.request.body.name,
            teacher_open_id: ctx.request.body.open_id
        };
        var res = await mysql(table_name).insert(courseInfo);
        ctx.state.data = res;
        console.log(res);
    },
    getCourseList: async (ctx, next) => {
        console.log("in getCourseList");
        var table_name = 'course';
        var teacher_open_id = ctx.request.body.open_id;
        var res = await mysql(table_name).select('*').where({ teacher_open_id: teacher_open_id });
        ctx.state.data = res;
        console.log(res);
    },
    getStudentAttendence: async (ctx, next) => {
        console.log("in getStudentAttendence");
        var table_name = '';
        let date = ctx.request.body.attend_date;
        var course_id = ctx.request.body.course_id;
        var teacher_open_id = ctx.request.body.teacher_open_id;
        console.log("date: " + date);
        // var res = await mysql('select_info')
        //                 .select('*')
        //                 .where({ 
        //                     course_id: course_id,
        //                     teacher_open_id: teacher_open_id
        //                 }).innerJoin('attendence', 'attend_date', '=', date)
        //                 .innerJoin('student', 'student.id', 'attendence.student_id');
        // var res = await mysql('select_info')
        //     .select('*')
        //     .where({
        //         course_id: course_id,
        //         teacher_open_id: teacher_open_id
        //     }).innerJoin('attendence', 'attendence.select_id', 'select_info.select_id')
        //     .innerJoin('attendence', 'attendence.attend_date', '=', date);
        var res = await mysql.raw('select s.student_id, a.if_attend, s.name from select_info as sl, student as s, attendence as a where a.attend_date = ? and sl.course_id = ? and sl.teacher_open_id = ? and sl.select_id = a.select_id and sl.student_id = s.student_id', [date, course_id, teacher_open_id]);
        ctx.state.data = res;
        console.log(res);
    },
    getFaceOwner: async (ctx, next) => {
        console.log("in getFaceOwner:")
        var face_id = ctx.request.body.face_id;
        var res = await mysql('face').select('*').where({ face_id: face_id });
        var student_info;
        console.log("res:")
        console.log(res)
        if (res.length != 0){
            var student_open_id = res[0].student_open_id;
            student_info = await mysql('student').select('*').where({ student_open_id: student_open_id });
        }
        console.log("student info:")
        console.log(student_info)
        ctx.state.data = student_info;
    },
    addFace: async (ctx, next) => {
        console.log("in addFace")
        var table_name = 'face';
        var face_info = {
            student_open_id: ctx.request.body.student_open_id,
            face_id: ctx.request.body.face_id
        }
        var res = await mysql(table_name).insert(face_info);
        ctx.state.data = res;
        console.log(res);
    },
    getFace: async(ctx, next) => {
        console.log("in getFace")
        var table_name = 'face';
        var face_info = {
            student_open_id: ctx.request.body.student_open_id
        }
        var res = await mysql(table_name).insert(face_info);
        ctx.state.data = res;
        console.log(res);
    }

}