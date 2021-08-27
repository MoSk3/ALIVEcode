import axios from 'axios';
import { loadObj} from './utils';
import { plainToClass } from 'class-transformer';
import { Course } from './Course/course.entity';
import { Section } from './Course/section.entity';
import { Classroom } from './Classroom/classroom.entity';
import { Professor, Student } from './User/user.entity';
import { IoTProject } from './Iot/IoTproject.entity';
import { IotRoute } from './Iot/IoTroute.entity';
import { IoTObject } from './Iot/IoTobject.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiGetter = <T extends {}, U extends boolean>(
	url: string,
	target: T,
	returnsArray: U,
) => {
	return async (id: string) =>
		(await loadObj(
			url.includes(':id') ? url.replace(':id', id) : url,
			target,
		)) as U extends true ? T[] : T;
};

// TODO : add build object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiCreate = <U extends {}>(moduleName: string, target: U) => {
	return async <T extends U>(fields: T): Promise<U | null> => {
		const data = (await axios.post(moduleName, fields)).data;
		if (!data) {
			return null;
		}
		return plainToClass(data, target);
	};
};
/*
const api = {
	db: {
		users: {
			iot: {
				async getProjects() {
					return (await axios.get(`users/iot/projects`)).data.map((d: any) =>
						plainToClass(IoTProject, d),
					);
				},
				async getObjects() {
					return (await axios.get(`users/iot/objects`)).data.map((d: any) =>
						plainToClass(IoTObject, d),
					);
				},
			},
			//get: apiGetter('users', User),
			async getClassrooms(userId: string) {
				return (await axios.get(`users/${userId}/classrooms`)).data;
			},
			getCourses(userId: string) {},
			createProfessor() {},
			createStudent() {},
		},
		classrooms: {
			async get(classroomId: string) {
				return plainToClass(
					Classroom,
					(await axios.get(`classrooms/${classroomId}`)).data,
				);
			},
			async getStudents(classroomId: string) {
				return (await axios.get(`classrooms/${classroomId}/students`)).data.map(
					(d: any) => plainToClass(Student, d),
				);
			},
			async getCourses(classroomId: string) {
				return (await axios.get(`classrooms/${classroomId}/courses`)).data.map(
					(d: any) => plainToClass(Course, d),
				);
			},
			create() {},
		},
		courses: {
			async get(courseId: string) {
				return plainToClass(
					Course,
					(await axios.get(`courses/${courseId}`)).data,
				);
			},
			async getSections(courseId: string) {
				return (await axios.get(`courses/${courseId}/sections`)).data.map(
					(d: any) => plainToClass(Section, d),
				);
			},
		},
		iot: {
			projects: {
				async get(projectId: string) {
					return plainToClass(
						IoTProject,
						(await axios.get(`iot/projects/${projectId}`)).data,
					);
				},
				async getRoutes(projectId: string) {
					return (await axios.get(`iot/projects/${projectId}/routes`)).data.map(
						(d: any) => plainToClass(IotRoute, d),
					);
				},
			},
		},
	},
};
*/

const api = {
	db: {
		users: {
			iot: {
				getProjects: apiGetter(
					'users/:id/iot/projects',
					IoTProject.prototype,
					true,
				),
				getObjects: apiGetter(
					'users/:id/iot/objects',
					IoTObject.prototype,
					true,
				),
			},
			//get: apiGetter('users', User),
			getClassrooms: apiGetter(
				'users/:id/classrooms',
				Classroom.prototype,
				true,
			),
			getCourses: apiGetter('users/:id/courses', Course.prototype, true),
			createProfessor: apiCreate('users/professors/:id', Professor.prototype),
			createStudent: apiCreate('users/students/:id', Student.prototype),
		},
		classrooms: {
			get: apiGetter('classrooms/:id', Classroom.prototype, false),
			getCourses: apiGetter('classrooms/:id/courses', Course.prototype, true),
			getStudents: apiGetter('students/:id', Student.prototype, true),
			create: apiCreate('classrooms', Classroom.prototype),
		},
		courses: {
			get: apiGetter('courses/:id', Course.prototype, false),
			getSections: apiGetter('courses/:id/sections', Section.prototype, true),
		},
		iot: {
			projects: {
				get: apiGetter('iot/projects/:id', IoTProject.prototype, false),
				getRoutes: apiGetter(
					'iot/projects/:id/routes',
					IotRoute.prototype,
					true,
				),
			},
		},
	},
};

export default api;
