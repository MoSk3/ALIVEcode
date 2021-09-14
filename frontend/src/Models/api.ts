import axios from 'axios';
import { loadObj} from './utils';
import { plainToClass } from 'class-transformer';
import { Course } from './Course/course.entity';
import { Section } from './Course/section.entity';
import { Classroom } from './Classroom/classroom.entity';
import { Student, User } from './User/user.entity';
import { IoTProject } from './Iot/IoTproject.entity';
import { IoTObject } from './Iot/IoTobject.entity';
import { IotRoute } from './Iot/IoTroute.entity';
import { Level } from './Level/level.entity';
import { LevelAlive } from './Level/levelAlive.entity';
import { LevelCode } from './Level/levelCode.entity';
import { LevelProgression } from './Level/levelProgression';
import { BrowsingQuery } from '../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import { LevelAI } from './Level/levelAI.entity';
import { Maintenance } from './Maintenance/maintenance.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiGetter = <T extends {}>(url: string, target: T) => {
	return async (id: string) =>
		await loadObj(
			url.includes(':id') ? url.replace(':id', id) : `${url}/${id}`,
			target,
		);
};

// TODO : add build object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		maintenances: {
			async getMaintenances() {
				return (await axios.get('maintenances')).data.map((d: any) =>
					plainToClass(Maintenance, d),
				);
			},
			async getUpcoming() {
				return plainToClass(
					Maintenance,
					(await axios.get('maintenances/upcoming')).data,
				);
			},
		},
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
			async getLevels(userId: string, query: BrowsingQuery) {
				return (await axios.post(`users/${userId}/levels`, query)).data.map(
					(l: any) => {
						if (l.layout) return plainToClass(LevelAlive, l);
						if (l.testCases) return plainToClass(LevelCode, l);
						if (l.ai) return plainToClass(LevelAI, l);
						return plainToClass(Level, l);
					},
				);
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
			async joinClassroom(code: string) {
				return plainToClass(
					Classroom,
					(await axios.post(`classrooms/students`, { code })).data,
				);
			},
			async leaveClassroom(classroomId: string, studentId: string) {
				return plainToClass(
					Classroom,
					(
						await axios.delete(
							`classrooms/${classroomId}/students/${studentId}`,
						)
					).data,
				);
			},
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
		levels: {
			async get(levelId: string) {
				const level = (await axios.get(`levels/${levelId}`)).data;
				if (level.layout) return plainToClass(LevelAlive, level);
				if (level.testCases) return plainToClass(LevelCode, level);
				if (level.ai) return plainToClass(LevelAI, level);
				return plainToClass(Level, level);
			},
			async query(query: BrowsingQuery) {
				const levels: Array<any> = (await axios.post(`levels/query`, query))
					.data;
				return levels.map((l: any) => {
					if (l.layout) return plainToClass(LevelAlive, l);
					if (l.testCases) return plainToClass(LevelCode, l);
					if (l.ai) return plainToClass(LevelAI, l);
					return plainToClass(Level, l);
				});
			},
			async update(level: Level | LevelAlive | LevelCode) {
				const l = (await axios.patch(`levels/${level.id}`, level)).data;
				if (l.layout) return plainToClass(LevelAlive, l);
				if (l.testCases) return plainToClass(LevelCode, l);
				if (l.ai) return plainToClass(LevelAI, l);
				return plainToClass(Level, l);
			},
			progressions: {
				async get(levelId: string, user: User) {
					return plainToClass(
						LevelProgression,
						(await axios.get(`levels/${levelId}/progressions/${user.id}`)).data,
					);
				},
				async save(levelId: string, user: User, data: LevelProgression) {
					return plainToClass(
						LevelProgression,
						(
							await axios.patch(
								`levels/${levelId}/progressions/${user.id}`,
								data,
							)
						).data,
					);
				},
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