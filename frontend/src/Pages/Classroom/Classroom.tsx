import ClassroomHeader from "../../Components/ClassroomComponents/ClassroomHeader/ClassroomHeader"
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { ClassroomProps } from './classroomTypes';
import { Row, Container, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { Classroom as ClassroomModel } from '../../Models/Classroom/classroom.entity';
import { useAlert } from 'react-alert';
import api from '../../Models/api';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import StudentCard from '../../Components/ClassroomComponents/StudentCard/StudentCard';
import ClassroomCard from '../../Components/DashboardComponents/ClassroomCard/ClassroomCard';
import { UserContext } from '../../state/contexts/UserContext';
import { prettyField } from '../../Types/formatting';
import useRoutes from '../../state/hooks/useRoutes';

const StyledDiv = styled.div`
	.classroom-content {
		width: 80%;
		margin-top: 50px;
		padding-bottom: 25px;
	}
`;

const Classroom = (props: ClassroomProps) => {
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const [classroom, setClassroom] = useState<ClassroomModel>();
	const { goBack } = useRoutes();
	const alert = useAlert();

	useEffect(() => {
		const getClassroom = async () => {
			try {
				const classroom = await api.db.classrooms.get({
					id: props.match.params.id,
				});
				await classroom.getStudents();
				await classroom.getCourses();
				setClassroom(classroom);
			} catch (err) {
				goBack();
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getClassroom();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.id]);

	if (!classroom || !user) {
		return <LoadingScreen />;
	}

	return (
		<StyledDiv>
			<ClassroomHeader classroom={classroom} />
			<Container className="classroom-content">
				<CardContainer
					title={t('classroom.container.courses.title')}
					height="60px"
				>
					{classroom.courses && classroom.courses.length > 0 ? (
						<ClassroomCard classroom={classroom} />
					) : (
						<p>{t('classroom.container.courses.empty')}</p>
					)}
				</CardContainer>
				<Row>
					<Col lg>
						<CardContainer title={t('classroom.container.details.title')}>
							<div>
								<h4>
									<Badge variant="primary">{t('classroom.subject')}</Badge>
								</h4>
								{classroom.getSubjectDisplay()}
								<h4>
									<Badge variant="primary">
										{prettyField(t('msg.description'))}
									</Badge>
								</h4>
								<p>
									{classroom.description
										? classroom.description
										: t('classroom.desc', {
												professor: classroom.creator.getDisplayName(),
										  })}
								</p>
							</div>
						</CardContainer>
					</Col>
					<Col lg>
						<CardContainer
							scrollY
							title={t('classroom.container.students.title')}
							height="60px"
						>
							{classroom.students && classroom.students.length > 0 ? (
								classroom.students.map((s, idx) => (
									<StudentCard key={idx} student={s} />
								))
							) : (
								<p>{t('classroom.container.students.empty')}</p>
							)}
						</CardContainer>
					</Col>
				</Row>
			</Container>
		</StyledDiv>
	);
};

export default Classroom;