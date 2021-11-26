import { Exclude, Type } from "class-transformer";
import { BackendUser } from "../../Types/userTypes";
import { CreatedByUser } from "../Generics/createdByUser.entity";
import { Student } from "../User/user.entity";

export class Post extends CreatedByUser {
    @Exclude({ toPlainOnly: true })
	@Type(() => Student)
    creator: Student;

    title: string;

    created_at: string;
    
    content: string;

    subject: {
        id: number;
    };

}