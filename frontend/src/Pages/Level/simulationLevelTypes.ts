import { RouteComponentProps } from "react-router-dom";

interface RouteParams {
	levelId: string;
}

export interface LevelProps extends RouteComponentProps<RouteParams> {}