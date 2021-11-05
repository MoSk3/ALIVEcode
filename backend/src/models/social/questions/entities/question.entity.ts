import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "../../answers/entities/answer.entity";
import { Quiz } from "../../quizzes/entities/quiz.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    name : string;

    @ManyToOne(() => Quiz, quiz => quiz.questions)
    @JoinColumn()
    quiz : Quiz;

    @OneToMany(() => Answer, answer => answer.question)
    answers : Answer[];
}
