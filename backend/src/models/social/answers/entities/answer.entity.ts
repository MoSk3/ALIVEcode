import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../questions/entities/question.entity";

@Entity()
export class Answer {

    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    value : string;

    @ManyToOne(() => Question, question => question.answers)
    @JoinColumn()
    question : Question;

    @Column({ default: false})
    is_good: boolean;
}
