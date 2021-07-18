import { Classroom } from './Playground/Classroom';
import Course from './Playground/Course';
import { Student } from "./User"
import { loadObj } from "./utils"

interface Model {
    readonly dependencies: {
        [name: string]: Function
    }
}


export const Database = {
    playground: {
        classrooms: {
            get all(): Promise<Classroom[]> {
                return loadObj(`/playground/classrooms`, Classroom) as Promise<Classroom[]>
            },
            collect(...ids: string[]): Promise<Classroom | Classroom[]> {
                if (ids.length === 0) throw new Error("You need to specify at least one id to collect");

                else if (ids.length === 1) return loadObj(`/playground/classrooms/${ids[0]}`, Classroom) as Promise<Classroom>
                
                else return Promise.all(ids.map((id) => loadObj(`/playground/classrooms/${id}`, Classroom))) as Promise<Classroom[]>;
            },
            get(id: string) {
                return {
                    get collect(): Promise<Classroom> {
                        return loadObj(`/playground/classrooms/${id}`, Classroom) as Promise<Classroom>
                    },
                    get students(): Promise<Student[]> {
                        return loadObj(`/playground/classrooms/${id}/students`, Student) as Promise<Student[]>
                    },
                    get courses(): Promise<Course[]> {
                        return loadObj(`/playground/classrooms/${id}/courses`, Course) as Promise<Course[]>
                    }
                }
            }
        }
    }
}






export default Model