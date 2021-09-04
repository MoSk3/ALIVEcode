import { Professor, Student } from '../Models/User/user.entity';

export enum GRADES {
	S1 = 's1',
}

export enum USER_TYPES {
	STUDENT = 0,
	PROFESSOR = 1,
}

export interface ProfessorInterface {
	firstName: string;
	lastName: string;
}

export interface StudentInterface {
	name: string;
	grade?: GRADES;
}

export interface UserInterface {
	email: string;
	professor?: Professor;
	student?: Student;
}

export type BackendUser = {
	id: string;
	email: string;
	name: string;
	scholarity: GRADES;
	firstName: string;
	lastName: string;
};