import { Card } from "react-bootstrap";
import CenteredContainer from "../../../Components/UtilsComponents/CenteredContainer/CenteredContainer";
import { QuizCategoryProps } from "./Category";

const QuizHome = (props: QuizCategoryProps) => {

	return (
		<div>
			<CenteredContainer
                horizontally
                textAlign="center"
                style={{ paddingLeft: '250px', paddingRight: '250px' }}    
            >
                <Card>
                    <h1> Test </h1>
                    <Card.Body>
                        test { props.match.params.id  }
                    </Card.Body>
                </Card>
			</CenteredContainer>


		</div>
	);
};

export default QuizHome;