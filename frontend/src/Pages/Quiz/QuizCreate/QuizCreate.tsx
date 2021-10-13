import { Col, Form, Row } from "react-bootstrap";
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { QuizCategoryProps } from '../QuizCategory/Category';

const QuizCreate = (props: QuizCategoryProps) => {
	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<Form>
					<Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
						<Form.Label column sm="2">
							Email
						</Form.Label>
						<Col sm="10">
							<Form.Control
								plaintext
								readOnly
								defaultValue="email@example.com"
							/>
						</Col>
					</Form.Group>

					<Form.Group
						as={Row}
						className="mb-3"
						controlId="formPlaintextPassword"
					>
						<Form.Label column sm="2">
							Password
						</Form.Label>
						<Col sm="10">
							<Form.Control type="password" placeholder="Password" />
						</Col>
					</Form.Group>
				</Form>
			</CenteredContainer>
		</div>
	);
};

export default QuizCreate;