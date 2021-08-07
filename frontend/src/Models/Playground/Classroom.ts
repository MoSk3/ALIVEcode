import { ClassroomInterface, CLASSROOM_SUBJECTS } from '../../Types/Playground/classroomTypes';
import { Database } from '../Model';
import { Professor, Student } from '../User';
import Course from './Course';

export class Classroom implements ClassroomInterface {
	public static dependencies = {
		creator: Professor,
		students: Student,
	};

	public readonly id: string;
	public name: string;
	public description: string;
	public subject: CLASSROOM_SUBJECTS;
	public creator: Professor;
	public students: Student[];
	public courses: Course[];
	public code: string;

	constructor({
		id,
		name,
		description,
		subject,
		creator,
		students,
		courses,
		code,
	}: ClassroomInterface) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.subject = subject;
		this.creator = creator;
		this.students = students;
		this.courses = courses;
		this.code = code;
	}

	async getStudents() {
		if (this.students) return this.students;
		this.students = await Database.playground.classrooms
			.get(this.id)
			.students();
		return this.students;
	}

	async getCourses() {
		if (this.courses) return this.courses;
		this.courses = await Database.playground.classrooms.get(this.id).courses();
		return this.courses;
	}

	static async getClassrooms(...ids: string[]) {
		await Database.playground.classrooms.ofCurrentUser; // get all the classrooms of the current user
		return await Database.playground.classrooms.collect(...ids);
	}

	getSubjectDisplay(): string {
		//loadObj(`/playground/classrooms/${this.id}/students`, Student).then(obj => console.log(obj))
		return this.subject;
	}
}