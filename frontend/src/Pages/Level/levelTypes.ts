import { RouteComponentProps } from "react-router-dom";

interface RouteParams {
	id: string;
}

export interface LevelProps extends RouteComponentProps<RouteParams> {}