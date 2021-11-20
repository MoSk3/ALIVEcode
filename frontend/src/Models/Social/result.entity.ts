import { User } from "../User/user.entity";
import { Quiz } from "./quiz.entity";
import { Reward } from '../../../../backend/src/models/social/rewards/entities/reward.entity';

export class Result {
    percentage : number;
    quiz: Quiz;
    count: number;
}

