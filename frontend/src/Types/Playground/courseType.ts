import { Professor, User } from '../../Models/User';

export enum COURSE_SUBJECT {
  INFORMATIC = "in",
  AI = "AI",
  MATH = "ma",
  SCIENCE = "sc"
}
export enum COURSE_DIFFICULTY {
    debutant = 1,
    facile = 2,
    intermédiaire = 3,
    avance = 4,
    difficile = 5,
    expert = 6
}

export enum COURSE_ACCESS {
    PU = "Public",             // can be found via a search
    UN = "Non répertorié",     // must be shared via a url
    RE = "Restrain",           // limited to certain classes
    PR = "Privé"               // only accessible to the creator
}

export interface CourseInterface {
  id: string;
  name: string;
  description: string;
  subject: COURSE_SUBJECT;
  creator: User;
  difficulty: COURSE_DIFFICULTY;
  access: COURSE_ACCESS;
  code: string;
}