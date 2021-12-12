import { Classroom } from '../../Models/Classroom/classroom.entity';

type RouteProps = {
  id: string;
};

export interface ClassroomProps {
  classroomProp?: Classroom;
};
