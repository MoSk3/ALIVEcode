import ClassroomHeader from "../../Components/ClassroomComponents/ClassroomHeader/ClassroomHeader"
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { ClassroomProps } from './classroomTypes';
import { Row, Container, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Classroom as ClassroomModel } from '../../Models/Classroom/classroom.entity';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import api from '../../Models/api';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import StudentCard from '../../Components/ClassroomComponents/StudentCard/StudentCard';
import ClassroomCard from '../../Components/DashboardComponents/ClassroomCard/ClassroomCard';

const StyledDiv = styled.div`
	.classroom-content {
		width: 80%;
		margin-top: 50px;
		padding-bottom: 25px;
	}
`;

const Classroom = (props: ClassroomProps) => {
	const { t } = useTranslation();
	const [classroom, setClassroom] = useState<ClassroomModel>();
	const history = useHistory();
	const alert = useAlert();

	useEffect(() => {
		const getClassroom = async () => {
			try {
				const classroom: ClassroomModel = await api.db.classrooms.get(
					props.match.params.id,
				);
				await classroom.getStudents();
				await classroom.getCourses();
				setClassroom(classroom);
			} catch (err) {
				history.push('/');
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getClassroom();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.id]);

	if (!classroom) {
		return <LoadingScreen />;
	}

	console.log(classroom);
	return (
		<StyledDiv>
			<ClassroomHeader classroom={classroom} />
			<Container className="classroom-content">
				<CardContainer title={t('classroom.container.courses')}>
					{/* TODO: add course card */}
					{classroom.courses && classroom.courses.length > 0 ? (
						<ClassroomCard classroom={classroom} />
					) : (
						<p>{t('msg.classrooms.courses.empty')}</p>
					)}
				</CardContainer>
				<Row>
					<Col lg>
						<CardContainer title={t('classroom.container.details')}>
							<div>
								<h4>
									<Badge variant="primary">Matière</Badge>
								</h4>
								{classroom.getSubjectDisplay()}
								<h4>
									<Badge variant="primary">Description</Badge>
								</h4>
								<p>
									{classroom.description
										? classroom.description
										: `Classe de ${classroom.getSubjectDisplay()}`}
								</p>
							</div>
						</CardContainer>
					</Col>
					<Col lg>
						<CardContainer scrollY title={t('classroom.container.students')}>
							{classroom.students && classroom.students.length > 0 ? (
								classroom.students.map((s, idx) => (
									<StudentCard key={idx} student={s} />
								))
							) : (
								<p>{t('msg.classroom.students.empty')}</p>
							)}
						</CardContainer>
					</Col>
				</Row>
			</Container>
		</StyledDiv>
	);
};

export default Classroom;