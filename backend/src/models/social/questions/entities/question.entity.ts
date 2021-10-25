import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "../../answers/entities/answer.entity";
import { Quiz } from "../../quizzes/entities/quiz.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    name : string;

    @ManyToOne(() => Quiz, quiz => quiz.id_questions)
    @JoinColumn( { name : 'id_quiz' } )
    id_quiz : Quiz;

    @OneToMany(() => Answer, answer => answer.id_question)
    id_answer : Answer[];
}
