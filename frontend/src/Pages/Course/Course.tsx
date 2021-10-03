import styled from 'styled-components';
import { CourseProps } from './courseTypes';
import CourseNavigation from '../../Components/CourseComponents/CourseNavigation/CourseNavigation';
import FillContainer from '../../Components/UtilsComponents/FillContainer/FillContainer';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import {
	CourseContext,
	CourseContentValues,
} from '../../state/contexts/CourseContext';
import CourseContent from '../../Components/CourseComponents/CourseContent/CourseContent';
import { Course as CourseModel } from '../../Models/Course/course.entity';
import api from '../../Models/api';
import { useTranslation } from 'react-i18next';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';
import { Section } from '../../Models/Course/section.entity';
import { plainToClass } from 'class-transformer';
import { Activity } from '../../Models/Course/activity.entity';

const StyledDiv = styled.div`
	.course-body {
	}
`;

const Course = (props: CourseProps) => {
	const { user } = useContext(UserContext);
	const [course, setCourse] = useState<CourseModel>();
	const [activity, setActivity] = useState<Activity>();

	const { t } = useTranslation();
	const alert = useAlert();
	const history = useHistory();

	const loadActivity = (activity: Activity) => {
		setActivity(activity);
	};

	const addSection = (section: Section) => {
		if (!course) return;
		course.sections.push(section);
		setCourse(plainToClass(CourseModel, course));
	};

	const addActivity = async (section: Section, activity: Activity) => {
		if (!course) return;
		await api.db.courses.addActivity(course?.id, section.id, activity);

		const sectionFound = course?.sections.find(s => s.id === section.id);
		if (!sectionFound || !course) return;

		course.sections = course?.sections.map(s => {
			if (s.id === sectionFound.id)
				s.activities
					? s.activities.push(activity)
					: (s.activities = [activity]);
			return s;
		});
		loadActivity(activity);
		setCourse(plainToClass(CourseModel, course));
	};

	const contextValue: CourseContentValues = {
		course,
		activity,
		loadActivity,
		addSection,
		addActivity,
	};

	useEffect(() => {
		const getCourse = async () => {
			try {
				const course: CourseModel = await api.db.courses.get({
					id: props.match.params.id,
				});
				await course.getSections();
				setCourse(course);
			} catch (err) {
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