import axios from 'axios';
import { loadObj} from './utils';
import { Classroom } from './Classroom/classroom.entity';
import { Section } from './Course/section.entity';
import { Course } from './Course/course.entity';
import { Professor, Student } from './User/user.entity';

const apiGetter = <T extends {}>(url: string, target: T) => {
	return async (id: string) =>
		await loadObj(
			url.includes(':id') ? url.replace(':id', id) : `${url}/${id}`,
			target,
		);
};

// TODO : add build object
const apiCreate = <U extends {}>(moduleName: string, target: U) => {
	return async <T extends U>(fields: T) => {
		const data = (await axios.post(moduleName, fields)).data;
		if (!data) {
			return null;
		}
		//return buildObj(data, target);
	};
};

const api = {
	db: {
		users: {
			//get: apiGetter('users', User),
			async getClassrooms(userId: string) {
				return (await axios.get(`users/${userId}/classrooms`)).data;
			},
			getCourses(userId: string) {},
			createProfessor() {},
			createStudent() {},
		},
		classrooms: {
			get() {},
			getStudents(classroomId: string) {},
			create() {},
		},
		courses: {
			async getSections(courseId: string) {
				return (await axios.get(`courses/${courseId}/sections`)).data;
			},
		},
	},
};

/*
const api = {
	db: {
		users: {
			//get: apiGetter('users', User),
			getClassrooms: apiGetter('users/:id/classrooms', Classroom),
			getCourses: apiGetter('users/:id/courses', Course),
			createProfessor: apiCreate('users/professors', Professor),
			createStudent: apiCreate('users/students', Student),
		},
		classrooms: {
			get: apiGetter('classrooms', Classroom),
			getStudents: apiGetter('students', Student),
			create: apiCreate('classrooms', Classroom),
		},
		courses: {
			getSections: apiGetter('courses/:id/sections', Section),
		},
	},
};
*/
export default api;
