import { Answer } from "./answer.entity";

export class QuestionForm {
    id: number;
    name: string;
    answers: [Answer];
}