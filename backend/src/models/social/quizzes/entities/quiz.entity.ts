import { UserEntity } from "src/models/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoriesQuiz } from "../../categories-quiz/entities/categories-quiz.entity";
import { Question } from "../../questions/entities/question.entity";
import { Result } from "../../results/entities/result.entity";
import { Reward } from "../../rewards/entities/reward.entity";

@Entity()
export class Quiz {
 
    @PrimaryGeneratedColumn()
    id : number;


    @ManyToOne(() => UserEntity, user => user.quiz)
    @JoinColumn( { name : 'id_user' } )
    user_id: UserEntity;

    @OneToOne(() => Reward, { eager: true })
    @JoinColumn()
    reward : Reward;

    @OneToMany(() => Question, question => question.id_quiz)
    id_questions: Question[];

    @OneToMany(() => Result, result => result.id_quiz)
    id_result: Result[];

    @ManyToOne(() => CategoriesQuiz, category => category.id, { eager: true })
    @JoinColumn()
    category: CategoriesQuiz;
    
    @Column('varchar')
    name : string;


}
