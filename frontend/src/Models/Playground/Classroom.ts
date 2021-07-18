import { ClassroomInterface, CLASSROOM_SUBJECTS } from '../../Types/Playground/classroomTypes';
import { Database } from '../Model';
import { Professor, Student } from '../User';


export class Classroom implements ClassroomInterface {

  public static dependencies = {
    creator: Professor,
    students: Student
  }

  public readonly id: string;
  public name: string;
  public description: string;
  public subject: CLASSROOM_SUBJECTS;
  public creator: Professor;
  public students: Student[];
  public courses: any[];
  public code: string;

  constructor({ id, name, description, subject, creator, students, courses, code }: ClassroomInterface) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.subject = subject;
    this.creator = creator;
    this.students = students;
    this.courses = courses;
    this.code = code;
  }

  static async loadAll(): Promise<Classroom[]> {
    //return await loadObj(`/playground/classrooms`, Classroom) as Classroom[];
    return await Database.playground.classrooms.all;
  }

  async getStudents() {
    return await Database.playground.classrooms.get(this.id).students;
  }

  static async getClassrooms(...ids: string[]) {
    return await Database.playground.classrooms.collect(...ids);
  }

  getSubjectDisplay(): string {

    //loadObj(`/playground/classrooms/${this.id}/students`, Student).then(obj => console.log(obj))
    return this.subject;
  }
}