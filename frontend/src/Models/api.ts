/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { loadObj } from './utils';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Course } from './Course/course.entity';
import { Section } from './Course/section.entity';
import { Classroom } from './Classroom/classroom.entity';
import { Professor, Student, User } from './User/user.entity';
import { IoTProject } from './Iot/IoTproject.entity';
import { IotRoute } from './Iot/IoTroute.entity';
import { Level } from './Level/level.entity';
import { LevelAlive } from './Level/levelAlive.entity';
import { LevelCode } from './Level/levelCode.entity';
import { LevelProgression } from './Level/levelProgression';
import { BrowsingQuery } from '../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import { LevelAI } from './Level/levelAI.entity';
import { IoTObject } from './Iot/IoTobject.entity';
import { Maintenance } from './Maintenance/maintenance.entity';
import { QueryDTO } from '../../../backend/src/models/level/dto/query.dto';
import { Quiz } from './Quiz/quiz.entity';
import { Category } from './Quiz/categories-quiz.entity';
import { QuizForm } from './Quiz/quizForm.entity';

type urlArgType<S extends string> = S extends `${infer _}:${infer A}/${infer B}`
	? A | urlArgType<B>
	: S extends `${infer _}:${infer A}`
	? A
	: never;

const formatQuery = (query: { [name: string]: string }) => {
	return (
		'?' +
		Object.entries(query)
			.map(([name, value]) => `${name}=${value}`)
			.join('&')
	);
};

const formatUrl = <S extends string>(
	url: string,
	args: { [key in urlArgType<S>]: string },
	query?: { [name: string]: string },
) => {
	return (
		url
			.split('/')
			.map(part =>
				part.startsWith(':') ? args[part.substring(1) as urlArgType<S>] : part,
			)
			.join('/') + (query === undefined ? '' : formatQuery(query))
	);
};

const apiGet = <T, S extends string, U extends boolean>(
	url: S,
	target: ClassConstructor<T>,
	returnsArray: U,
	overrideCast?: (data: any) => T | T[],
) => {
	return async (
		args: { [key in urlArgType<S>]: string },
		query?: { [name: string]: string },
	) => {
		if (overrideCast !== undefined) {
			const data = await (await axios.get(formatUrl(url, args, query))).data;
			return (
				Array.isArray(data)
					? data.map(d => overrideCast(d))
					: overrideCast(data)
			) as U extends true ? T[] : T;
		}
		return (await loadObj(formatUrl(url, args), target)) as U extends true
			? T[]
			: T;
	};
};

const apiDelete = <S extends string>(url: S) => {
	return async (
		args: { [key in urlArgType<S>]: string },
		query?: { [name: string]: string },
	) => {
		return await axios.delete(formatUrl(url, args, query));
	};
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiCreate = <T>(moduleName: string, target: ClassConstructor<T>) => {
	return async (fields: any): Promise<T> => {
		const data = (await axios.post(moduleName, fields)).data;
		return plainToClass(target, data);
	};
};

const apiUpdate = <T, S extends string>(
	url: S,
	target: ClassConstructor<T>,
	overrideCast?: (data: any) => T,
) => {
	return async (
		args: { [key in urlArgType<S>]: string },
		fields: object,
		query?: { [name: string]: string },
	): Promise<T> => {
		const data = (await axios.patch(formatUrl(url, args, query), fields)).data;
		if (overrideCast !== undefined) return overrideCast(data);
		return plainToClass(target, data);
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
				getProjects: apiGet('users/iot/projects', IoTProject, true),
				getObjects: apiGet('users/iot/objects', IoTObject, true),
			},
			//get: apiGetter('users', User),
			getClassrooms: apiGet('users/:id/classrooms', Classroom, true),
			getCourses: apiGet('users/:id/courses', Course, true),
			getLevels: apiGet('users/:id/levels', Level, true, level => {
				if (level.layout) return plainToClass(LevelAlive, level);
				else if (level.testCases) return plainToClass(LevelCode, level);
				return plainToClass(Level, level);
			}),
			createProfessor: apiCreate('users/professors', Professor),
			createStudent: apiCreate('users/students', Student),
			delete: apiDelete('users/:id'),
		},
		classrooms: {
			all: apiGet('classrooms', Classroom, true),
			get: apiGet('classrooms/:id/', Classroom, false),
			getCourses: apiGet('classrooms/:id/courses', Course, true),
			getStudents: apiGet('classrooms/:id/students', Student, true),
			create: apiCreate('classrooms', Classroom),
			delete: apiDelete('classrooms/:id'),
			join: apiCreate('classrooms/students', Classroom),
			leave: apiDelete('classrooms/:classroomId/students/:studentId'),
		},
		courses: {
			get: apiGet('courses/:id', Course, false),
			getSections: apiGet('courses/:id/sections', Section, true),
			delete: apiDelete('courses/:id'),
		},
		levels: {
			progressions: {
				get: apiGet('levels/:id/progressions/:userId', LevelProgression, false),
				save: apiUpdate('levels/:id/progressions/:userId', LevelProgression),
			},
			get: apiGet('levels/:id', Level, false, level => {
				if (level.layout) return plainToClass(LevelAlive, level);
				else if (level.testCases) return plainToClass(LevelCode, level);
				return plainToClass(Level, level);
			}),
			update: apiUpdate('levels/:id', Level, level => {
				if (level.layout) return plainToClass(LevelAlive, level);
				else if (level.testCases) return plainToClass(LevelCode, level);
				return plainToClass(Level, level);
			}),
			async query(body: QueryDTO) {
				return (await axios.post('levels/query', body)).data.map((d: any) =>
					plainToClass(Level, d),
				);
			},
		},
		iot: {
			projects: {
				get: apiGet('iot/projects/:id', IoTProject, false),
				getRoutes: apiGet('iot/projects/:id/routes', IotRoute, true),
			},
		},
		quiz: {
			all: apiGet('/quizzes', Quiz, true),
			one: apiGet('/quizzes/:id', Quiz, false),
			create: apiCreate('/quizzes', QuizForm),
			update: apiUpdate('/quizzes/:id', QuizForm),
			delete: apiDelete('/quizzes/:id'),
			categories: {
				all: apiGet('/categories-quiz', Category, true),
				one: apiGet('/categories-quiz/:id', Category, false),
			}
		},
	},
};

export default api;
