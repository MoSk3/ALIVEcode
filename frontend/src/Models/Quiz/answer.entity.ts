import { Question } from './question.entity';

export class Answer {
    id: string;
    value: string;
    question: Question;
    is_good: string;
}