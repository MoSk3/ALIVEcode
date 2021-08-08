import { Student, Professor } from './User';
import axios from 'axios';
import { ProfessorInterface, StudentInterface } from '../Types/userTypes';
import { ClassroomInterface } from '../Types/Playground/classroomTypes';
import { Classroom } from './Playground/Classroom';

const apiGetter = (moduleName: string) => {
	return async (id: string) => (await axios.get(`${moduleName}/${id}`)).data;
};

const apiCreate = <T>(moduleName: string, obj: Function) => {
	return async (fields: T) => {};
};

const api = {
	models: {
		user: {
			get: apiGetter('user'),
			async createProfessor(fields: ProfessorInterface) {
				const data = (await axios.post('user/professor', fields)).data;
				if (!data) {
					return null;
				}
				return new Professor(data);
			},
			async createStudent(fields: StudentInterface) {
				const data = (await axios.post('user/student', fields)).data;
				if (!data) {
					return null;
				}
				return new Student(data);
			},
		},
		classroom: {
			get: apiGetter('classroom'),
			async create(fields: ClassroomInterface) {
				const data = (await axios.post('classroom', fields)).data;
				if (!data) {
					return null;
				}
				return new Classroom(fields);
			},
		},
	},
};

export default api;
