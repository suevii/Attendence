const qcloud = require('../qcloud.js');

const { mysql } = qcloud
const USERINFO_TABLE = 'userInfo'

module.exports = {
	sinsert: async (ctx, next) => {
        var res = await mysql('student').select('*');
		ctx.state.data = res;
		console.log("res: " + res);
    },
    getUserCharacter: async (ctx, next) => {
        console.log("in getUserCharacter");
        let open_id = ctx.request.body.open_id;
        var res = await mysql(USERINFO_TABLE).select('*').where({ open_id: open_id });
        ctx.state.data = res;
        console.log(res);
    },
    setUserCharacter: async (ctx, next) => {
        console.log("in setUserCharacter");
        var userInfo = {
            open_id: ctx.request.body.open_id,
            if_teacher: ctx.request.body.if_teacher
        };
        var res = await mysql(USERINFO_TABLE).insert(userInfo);
        ctx.state.data = res;
        console.log(res);
    },
    
    getUserInfo: async (ctx, next) => {
        //table_name = 'student' or 'teacher'
        console.log("in getUserInfo");
        var table_name = ctx.request.body.table_name,
            open_id = ctx.request.body.open_id;
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
    // getTeacher: async (ctx, next) => {
    //     console.log("in getTeacher");
    //     var table_name = 'teacher';
    //     var teacher_open_id = ctx.request.body.teacher_open_id;
    //     console.log("teacher_open_id: " + teacher_open_id)
    //     var res = await mysql(table_name).select('*').where({ open_id: teacher_open_id });
    //     ctx.state.data = res;
    //     console.log(res);
    // },
    
}