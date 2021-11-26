import { BackendUser } from "../../Types/userTypes";

export class Post {

    title: string;

    created_at: string;
    
    content: string;

    subject: {
        id: number;
    };

    creator: {
        id: string;
    };

    user: BackendUser;

}