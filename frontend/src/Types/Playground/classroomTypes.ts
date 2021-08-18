import { Course } from '../../Models/Course/course.entity';
import { Professor, Student } from '../../Models/User/user.entity';

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