import { Professor, Student } from "../Models/User";

export enum GRADES {
    S1 = "s1"
}

export enum USER_TYPES {
    STUDENT = 0,
    PROFESSOR = 1
}

export interface ProfessorInterface { 
    first_name: string;
    last_name: string;
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
    email: string;
    name: string;
    scholarity: GRADES;
    first_name: string;
    last_name: string;
}