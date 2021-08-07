import styled from 'styled-components';
import { ClassroomProps } from './classroomTypes';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import Button from '../../Components/MainComponents/Button/Button';

const StyledClassroom = styled.div`
	color: white;
	border-radius: 15px;
	background-color: rgba(var(--primary-color-rgb), 0.92);
	margin-top: 25px;
	width: 85%;
	padding: 50px;
	box-shadow: 0px 5px 15px rgb(95 95 95);

	span {
		margin-top: 10px;
		font-size: 20px;
		background-color: var(--secondary-color);
	}

	#classroom-buttons {
		text-align: right;
	}

	#classroom-buttons button {
		margin: 10px;
		font-size: 16px;
		font-weight: bold;
	}
`;

const Classroom = (props: ClassroomProps) => {
	return (
		<StyledClassroom as={Container}>
			<Row>
				<Col lg>
					<h2>Classe pour tester</h2>
					<h5>
						<Badge variant="primary">Professeur</Badge>
						{' Enric, Soldevila'}
					</h5>
				</Col>
				<Col lg id="classroom-buttons">
					<div>
						<Button variant="primary">Ajouter des étudiants</Button>
					</div>
					<div>
						<Button variant="danger">Supprimer la classe</Button>
					</div>
				</Col>
			</Row>
		</StyledClassroom>
	);
};

export default Classroom;