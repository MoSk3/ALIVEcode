import { CourseInterface, COURSE_ACCESS, COURSE_DIFFICULTY, COURSE_SUBJECT } from '../../Types/Playground/courseType';
import { User } from '../User';

class Course implements CourseInterface {
    public readonly id: string;
    public name: string;
    public description: string;
    public subject: COURSE_SUBJECT;
    public creator: User;
    public difficulty: COURSE_DIFFICULTY;
    public access: COURSE_ACCESS;
    public code: string;

    public static dependencies = {
        creator: User
    }

    constructor({ id, name, description, subject, creator, difficulty, access, code }: CourseInterface) {
        this.id = id
        this.name = name
        this.description = description
        this.subject = subject
        this.creator = creator
        this.difficulty = difficulty
        this.access = access
        this.code = code
    }

    loadAll() {

    }

}


export default Course