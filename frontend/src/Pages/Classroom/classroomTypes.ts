import { RouteComponentProps } from 'react-router-dom';

type RouteProps = {
  id: string;
};

export interface ClassroomProps extends RouteComponentProps<RouteProps> {};
