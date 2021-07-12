import { USER_TYPES, GRADES } from '../../../Types/User';

export type SignUpProps = {
  userType: USER_TYPES;
}

export type FormSignUpValues = {
  email: string;
  password: string;

  // Student
  student?: {
    name: string;
    scholarity: GRADES;
  }

  // Professor
  professor?: {
    first_name?: string;
    last_name?: string;
  }
}