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
      let open_id = ctx.request.body.open_id;
      var res = await mysql('userInfo').select('*').where({ open_id: open_id });
      ctx.state.data = res;
      console.log("mysql→res: ");
      console.log(res);
    },
    addCourse: async (ctx, next) => {
        var courseInfo = {
            id: ctx.request.body.id,
            name: ctx.request.body.name
        };
        console.log("courseInfo: " + courseInfo);
        var res = await mysql('course').insert(courseInfo);
        ctx.state.data = res;
        console.log("res: " + res);
    },
    getCourseList: async (ctx, next) => {
        var res = await mysql('course').select('*');
        ctx.state.data = res;
        console.log("res: " + res);
    },
    getStudentAttendence: async (ctx, next) => {
      let date = ctx.request.body.attend_date;
      console.log("date: " + date);
      var res = await mysql('attendence').select('*').where({ attend_date: date }).innerJoin('student', 'student.id', 'attendence.student_id');
      ctx.state.data = res;
      console.log("res: " + res);
    }

}