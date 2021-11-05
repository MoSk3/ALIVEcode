import { BackendUser } from "../../Types/userTypes";

export class Post {
    id: number;
    
    title: string;

    created_at: string;
    
    content: string;

    user: BackendUser;

}