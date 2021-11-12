import { Question } from "./question.entity";

export class Quiz {
    id: number;
    name: string;
    questions: [Question];
}