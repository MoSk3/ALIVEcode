import styled from 'styled-components';
import { CourseProps } from './courseTypes';
import CourseNavigation from '../../Components/CourseComponents/CourseNavigation/CourseNavigation';
import FillContainer from '../../Components/UtilsComponents/FillContainer/FillContainer';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import { CourseContext } from '../../state/contexts/CourseContext';
import CourseContent from '../../Components/CourseComponents/CourseContent/CourseContent';
import { Course as CourseModel } from '../../Models/Course/course.entity';
import api from '../../Models/api';
import { useTranslation } from 'react-i18next';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';

const StyledDiv = styled.div`
	.course-body {
	}
`;

const Course = (props: CourseProps) => {
	const { user } = useContext(UserContext);
	const [course, setCourse] = useState<CourseModel>();

	const { t } = useTranslation();
	const alert = useAlert();
	const history = useHistory();

	const loadActivity = (id: string) => {
		return id;
	};

	const contextValue = {
		course,
		loadActivity,
	};

	useEffect(() => {
		const getCourse = async () => {
			try {
				const course = await api.db.courses.get(props.match.params.id);
				setCourse(course);
			} catch {
				history.push('/');
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};

		getCourse();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.id, user]);

	useState();

	if (!course) return <></>;
	return (
		<CourseContext.Provider value={contextValue}>
			<StyledDiv>
				<FillContainer className="course-body">
					<CourseNavigation />
					<CourseContent />
				</FillContainer>
			</StyledDiv>
		</CourseContext.Provider>
	);
};

export default Course;