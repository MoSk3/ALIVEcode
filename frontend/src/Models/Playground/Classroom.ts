import { ClassroomInterface, CLASSROOM_SUBJECTS } from '../../Types/Playground/classroomTypes';
import { Professor, Student } from '../User';
import axios from 'axios';

export class Classroom implements ClassroomInterface {
  public readonly id: string;
  public name: string;
  public description: string;
  public subject: CLASSROOM_SUBJECTS;
  public creator: Professor;
  public students: Student[];
  public courses: any[];
  public code: string;

  constructor({id, name, description, subject, creator, students, courses, code} : ClassroomInterface) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.subject = subject;
    this.creator = Object.setPrototypeOf(creator, Professor.prototype);
    this.students = students;
    this.courses = courses;
    this.code = code;
  }

  static async loadAll(): Promise<Array<Classroom>> {
    const classrooms = (await axios.get('/playground/classrooms')).data;
    console.log((await axios.get(`/playground/classrooms/${classrooms[0].id}/students`)).data)
    return classrooms.map((obj: any) => Object.assign(Classroom.prototype, obj));
  }

  getSubjectDisplay = ():string => {
    return this.subject;
  }

}