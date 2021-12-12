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
import { UserContext } from '../../state/contexts/UserContext';
import { prettyField } from '../../Types/formatting';
import useRoutes from '../../state/hooks/useRoutes';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import CourseCard from '../../Components/CourseComponents/CourseCard/CourseCard';
import { useParams } from 'react-router';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';

const StyledDiv = styled.div`
	.classroom-content {
		width: 80%;
		margin-top: 50px;
		padding-bottom: 25px;
	}
`;

/**
 * Classroom page
 *
 * @param id (as a url parameter)
 * @returns tsx element
 */
const Classroom = ({ classroomProp, ...props }: ClassroomProps) => {
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [classroom, _] = useState<ClassroomModel | undefined>(
		classroomProp ?? undefined,
	);
	const { id } = useParams<{ id: string }>();
	const { goBack, routes } = useRoutes();
	const history = useHistory();
	const alert = useAlert();
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		const getClassroom = async () => {
			try {
				const classroom =
					classroomProp ??
					(await api.db.classrooms.get({
						id,
					}));
				await classroom.getStudents();
				await classroom.getCourses();
				forceUpdate();
			} catch (err) {
				goBack();
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getClassroom();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, classroomProp]);

	if (!classroom || !user) {
		return <LoadingScreen />;
	}

	return (
		<StyledDiv>
			<ClassroomHeader classroom={classroom} />
			{/*<Container className="classroom-content">
				<CardContainer
					asRow
					title={t('classroom.container.courses.title')}
					height="60px"
					icon={classroom.creator.id === user.id ? faPlus : undefined}
					onIconClick={() =>
						history.push({
							pathname: routes.auth.create_course.path,
							state: { classroom },
						})
					}
				>
					{classroom.courses && classroom.courses.length > 0 ? (
						classroom.courses.map((c, idx) => (
							<CourseCard key={idx} course={c} />
						))
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
							</Container>*/}
		</StyledDiv>
	);
};

export default Classroom;