import { Exclude, Type } from 'class-transformer';
import api from '../api';
import { Course } from '../Course/course.entity';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { Professor, Student } from '../User/user.entity';

export enum CLASSROOM_SUBJECT {
	INFORMATIC = 'IN',
	AI = 'AI',
	MATH = 'MA',
	SCIENCE = 'SC',
}

export class Classroom extends CreatedByUser {
	@Exclude({ toPlainOnly: true })
	@Type(() => Professor)
	creator: Professor;

	// The code consists of letters from a-z and numbers from 0-9 | case non-senstive
	code?: string;

	subject: CLASSROOM_SUBJECT;

	students?: Student[];
	courses?: Course[];

	async getCourses() {
		this.courses = await api.db.classrooms.getCourses({ id: this.id });
		return this.courses;
	}

	async getStudents() {
		this.students = await api.db.classrooms.getStudents({ id: this.id });
		return this.students;
	}

	getSubjectDisplay() {
		return this.subject[0].toUpperCase() + this.subject.slice(1);
	}
}
