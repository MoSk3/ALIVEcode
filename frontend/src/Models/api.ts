import { Student, Professor } from './User';
import axios from 'axios';
import { ProfessorInterface, StudentInterface } from '../Types/userTypes';

const api = {
	models: {
		user: {
			async get(id: string) {
				return (await axios.get(`user/${id}`)).data;
			},
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
	},
};

export default api;
