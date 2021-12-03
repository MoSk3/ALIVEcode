import { Answer } from "./answer.entity";
import { QuizForm } from "./quizForm.entity";

export class QuestionForm {
    id: number;
    name: string;
    quiz: QuizForm;
    answers: [Answer];
}