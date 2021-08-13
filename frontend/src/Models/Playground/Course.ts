import {
	CourseInterface,
	COURSE_ACCESS,
	COURSE_DIFFICULTY,
	COURSE_SUBJECT,
} from '../../Types/Playground/courseType';
import { User } from '../User';

export class Activity {
	public name: string;
	public description?: string;

	constructor(name: string, description?: string) {
		this.name = name;
		this.description = description;
	}
}

export class Section {
	public name: string;
	public activities: Array<Activity>;

	constructor(name: string, activities: Array<Activity>) {
		this.name = name;
		this.activities = activities;
	}
}

class Course implements CourseInterface {
	public readonly id: string;
	public name: string;
	public description: string;
	public subject: COURSE_SUBJECT;
	public creator: User;
	public difficulty: COURSE_DIFFICULTY;
	public access: COURSE_ACCESS;
	public code: string;
	public sections: Array<Section>;

	public static dependencies = {
		creator: User,
	};

	constructor({
		id,
		name,
		description,
		subject,
		creator,
		difficulty,
		access,
		code,
		sections,
	}: CourseInterface) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.subject = subject;
		this.creator = creator;
		this.difficulty = difficulty;
		this.access = access;
		this.code = code;
		this.sections = sections;
	}

	loadAll() {}
}

export default Course;