import { UserEntity } from "src/models/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "../../quizzes/entities/quiz.entity";

@Entity()
export class Result {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => UserEntity, user => user.result)
    @JoinColumn( { name : 'id_user' } )
    user_id: UserEntity;

    @ManyToOne(() => Quiz, quiz => quiz.id_result)
    @JoinColumn( { name : 'id_quiz' } )
    id_quiz : Quiz;


}

