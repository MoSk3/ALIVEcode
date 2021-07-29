import { RouteComponentProps } from "react-router-dom";

interface RouteParams {
  challengeId: string
}

export interface ChallengeProps extends RouteComponentProps<RouteParams> {

}