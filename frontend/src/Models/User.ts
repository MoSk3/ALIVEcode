import {
	BackendUser,
	GRADES,
	UserInterface,
} from '../Types/userTypes';
import axios from 'axios';

export abstract class User implements UserInterface {
	public abstract readonly id: string;
	public abstract readonly email: string;

	public getDisplayName() {
		return this.email;
	}

	static async loadUser() {
		const backendUser: BackendUser = (await axios.get('/users/me')).data;
		try {
			if (backendUser.firstName && backendUser.lastName)
				return new Professor(backendUser);
			if (backendUser.name) return new Student(backendUser);

			throw new Error('Could not load user');
		} catch (err) {
			return null;
		}
	}

	// LE CODE MAUDIT :
	/*
  async getClassrooms(): Promise<Classroom[]> {
    //return await loadObj(`/playground/classrooms`, Classroom) as Classroom[];
    return await Database.playground.classrooms.all;
  }
  */
}

export class Professor extends User {
	public readonly id: string;
	public readonly email: string;
	public static dependencies = {};

	public firstName: string;
	public lastName: string;

	constructor({
		id,
		email,
		firstName,
		lastName,
	}: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
	}) {
		super();
		this.id = id;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
	}

	getDisplayName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
}

export class Student extends User {
	public readonly id: string;
	public readonly email: string;
	public static dependencies = {};

	public name: string;
	public grade: GRADES | undefined;

	// TODO : add scholarity
	constructor({
		id,
		email,
		name,
	}: {
		id: string;
		email: string;
		name: string;
	}) {
		super();
		this.id = id;
		this.email = email;
		this.name = name;
	}

	getDisplayName() {
		return this.name;
	}
}