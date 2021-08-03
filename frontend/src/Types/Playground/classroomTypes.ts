import Course from '../../Models/Playground/Course';
import { Professor, Student } from '../../Models/User';

export enum CLASSROOM_SUBJECTS {
	INFORMATIC = 'in',
	AI = 'AI',
	MATH = 'ma',
	SCIENCE = 'sc',
}

export interface ClassroomInterface {
	id: string;
	name: string;
	description: string;
	subject: CLASSROOM_SUBJECTS;
	creator: Professor;
	students: Array<Student>;
	courses: Array<Course>;
	code: string;
}