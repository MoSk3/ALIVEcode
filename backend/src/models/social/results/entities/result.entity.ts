import { UserEntity } from "src/models/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "../../quizzes/entities/quiz.entity";

@Entity()
export class Result {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => UserEntity, user => user.result,  { eager: true})
    user: UserEntity;

    @ManyToOne(() => Quiz, quiz => quiz.results)
    @JoinColumn()
    quiz : Quiz[];

    @Column({type: 'int', default: 0})
    percentage : number;

}

