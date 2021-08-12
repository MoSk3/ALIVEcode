import ClassroomHeader from "../../Components/ClassroomComponents/ClassroomHeader/ClassroomHeader"
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { ClassroomProps } from './classroomTypes';
import { Row, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';

const StyledDiv = styled.div`
	.classroom-content {
		width: 80%;
		margin-top: 50px;
		padding-bottom: 25px;
	}
`;

const Classroom = (props: ClassroomProps) => {
	const { t } = useTranslation();

	return (
		<StyledDiv>
			<ClassroomHeader />
			<Container className="classroom-content">
				<CardContainer title={t('classroom.container.courses')}></CardContainer>
				<Row>
					<Col lg>
						<CardContainer
							title={t('classroom.container.details')}
						></CardContainer>
					</Col>
					<Col lg>
						<CardContainer
							scrollY
							title={t('classroom.container.students')}
						></CardContainer>
					</Col>
				</Row>
			</Container>
		</StyledDiv>
	);
};

export default Classroom;