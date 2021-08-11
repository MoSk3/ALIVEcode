import { Student, Professor, User } from './User';
import axios from 'axios';
import { Classroom } from './Playground/Classroom';
import { loadObj, buildObj } from './utils';
import Model from './Model';

const apiGetter = <T extends Function & Model>(url: string, target: T) => {
	return async (id: string) =>
		await loadObj(
			url.includes(':id') ? url.replace(':id', id) : `${url}/${id}`,
			target,
		);
};

const apiCreate = <U extends Function & Model>(
	moduleName: string,
	target: U,
) => {
	return async <T extends U>(fields: T) => {
		const data = (await axios.post(moduleName, fields)).data;
		if (!data) {
			return null;
		}
		return buildObj(data, target);
	};
};

const api = {
	db: {
		users: {
			//get: apiGetter('users', User),
			getClassrooms: apiGetter('users/:id/classrooms', Classroom),
			createProfessor: apiCreate('users/professors', Professor),
			createStudent: apiCreate('users/students', Student),
		},
		classrooms: {
			get: apiGetter('classrooms', Classroom),
			create: apiCreate('classrooms', Classroom),
		},
	},
};

export default api;
