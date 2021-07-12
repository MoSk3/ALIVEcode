
export enum GRADES {
    SE_1
}

export enum USER_TYPES {
    STUDENT = 0,
    PROFESSOR = 1
}

export type Professor = { 
    first_name: string;
    last_name: string;
}

export type Student = { 
    name: string;
    grade?: GRADES;
}

export type User = {
    email: string;
    name: string;
    professor?: Professor;
    student?: Student;
}