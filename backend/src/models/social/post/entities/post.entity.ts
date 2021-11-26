import { IsNotEmpty, IsOptional } from "class-validator";
import { UserEntity } from "src/models/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Subject } from "../../subjects/entities/subject.entity";

@Entity()
export class Post{
    
    @PrimaryGeneratedColumn()
    id : number;
    
    @Column('varchar')
    @IsNotEmpty()
    title : string;

    @Column('text')
    @IsNotEmpty()
    content : string;

    @Column('varchar')
    @IsNotEmpty()
    created_at : Timestamp;

    @ManyToOne(() => Subject, subject => subject.posts)
    @JoinColumn()
    @IsNotEmpty()
    subject : Subject;

    @ManyToOne(() => UserEntity, user => user.post, { eager: true })
    @JoinColumn()
    @IsNotEmpty()
    creator: UserEntity;




}

