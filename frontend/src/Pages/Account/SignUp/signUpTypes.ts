import { USER_TYPES } from '../../../Types/userTypes';

export type SignUpProps = {
	userType: USER_TYPES;
};

export type FormSignUpValues = {
	email: string;
	password: string;

	// Student
	name?: string;

	// Professor
	firstName?: string;
	lastName?: string;
};