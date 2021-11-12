import { Quiz } from "./quiz.entity";

export class Question {
    id: string;
    name: string;
    quiz: Quiz;
}