import { BackendUser, GRADES, ProfessorInterface, StudentInterface, UserInterface } from '../Types/userTypes';
import axios from 'axios';

export class Professor implements ProfessorInterface {

  public static dependencies = {}

  public first_name: string;
  public last_name: string;

  constructor(first_name: string, last_name: string) {
    this.first_name = first_name;
    this.last_name = last_name;
  }

  getDisplayName(): string {
    return `${this.first_name} ${this.last_name}`
  }
}

export class Student implements StudentInterface {

  public static dependencies = {}

  public name: string;
  public grade: GRADES | undefined;

  constructor(name: string, grade: GRADES) {
    this.name = name;
    this.grade = grade;
  }

  getDisplayName() {
    return this.name;
  }

}

export class User implements UserInterface {

  public email: string;
  public professor?: Professor;
  public student?: Student;

  constructor(backendUser: BackendUser) {
    this.email = backendUser.email;
    if(backendUser.first_name && backendUser.last_name)
      this.professor = new Professor(backendUser.first_name, backendUser.last_name);
    else if(backendUser.name && backendUser.scholarity)
      this.student = new Student(backendUser.name, backendUser.scholarity);
  }

  public getDisplayName() {
    if(this.professor) return this.professor.getDisplayName();
    if(this.student) return this.student.getDisplayName();
    return this.email;
  }

  static async loadUser() {
    const backendUser: BackendUser = (await axios.get('/api/user/info/')).data;
    try {
      return new User(backendUser);
    } catch(err) {
      return null;
    }
  }

}