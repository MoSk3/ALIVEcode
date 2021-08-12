import styled from 'styled-components';
import { ClassroomHeaderProps } from './classroomHeaderTypes';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import Button from '../../UtilsComponents/Button/Button';

const StyledClassroomHeader = styled.div`
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

	@media screen and (max-width: 991px) {
		#classroom-title {
			text-align: center;
		}

		#classroom-buttons {
			margin-top: 15px;
			text-align: center;
		}

		#classroom-courses {
			margin-top: 50px;
		}

		/*
		#classroom-details-header {
				margin-top: 25px;  
		}
		#classroom-students-header {
				margin-top: 25px;   
		}
		*/

		#classroom-students-body {
			height: calc(50vh - 110px);
		}

		#classroom-courses-body {
			height: calc(55vh - 110px);
		}
	}
`;

const ClassroomHeader = (props: ClassroomHeaderProps) => {
	return (
		<StyledClassroomHeader as={Container}>
			<Row>
				<Col lg id="classroom-title">
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
		</StyledClassroomHeader>
	);
};

export default ClassroomHeader;