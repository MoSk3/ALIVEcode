import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../questions/entities/question.entity";

@Entity()
export class Answer {

    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    @IsNotEmpty()
    value : string;

    @ManyToOne(() => Question, question => question.answers)
    @JoinColumn()
    @IsNotEmpty()
    question : Question;

    @Column({ default: false})
    @IsNotEmpty()
    is_good: boolean;
}
