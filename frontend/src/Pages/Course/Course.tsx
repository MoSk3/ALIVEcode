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
import ActivityContent from '../../Components/CourseComponents/ActivityContent/ActivityContent';
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

/**
 * Course page that shows the content of a course
 *
 * @param id (as a url parameter)
 * @author MoSk3
 */
const Course = (props: CourseProps) => {
	const { user } = useContext(UserContext);
	const [course, setCourse] = useState<CourseModel>();
	const [section, setSection] = useState<Section>();
	const [activity, setActivity] = useState<Activity>();

	const { t } = useTranslation();
	const alert = useAlert();
	const history = useHistory();

	const saveActivity = async (activity: Activity) => {
		if (!course || !activity || !section) return;
		const { content, ...actWithoutContent } = activity;

		const updatedAct = await api.db.courses.updateActivity(
			{
				courseId: course.id,
				sectionId: section.id.toString(),
				activityId: activity.id.toString(),
			},
			actWithoutContent,
		);
		setActivity(updatedAct);
	};

	const saveActivityContent = async (data: string) => {
		if (!course || !activity || !section) return;
		const activityDTO = { ...activity, content: { data } };
		const updatedAct = await api.db.courses.updateActivity(
			{
				courseId: course.id,
				sectionId: section.id.toString(),
				activityId: activity.id.toString(),
			},
			activityDTO,
		);
		setActivity(updatedAct);
	};

	const loadActivity = async (section: Section, activity: Activity) => {
		if (!course) return;
		await activity.getContent(course?.id, section.id);
		setActivity(activity);
		setSection(section);
	};

	const addSection = (section: Section) => {
		if (!course) return;
		course.sections.push(section);
		setCourse(plainToClass(CourseModel, course));
	};

	const addActivity = async (section: Section, newAct: Activity) => {
		if (!course) return;
		newAct = await api.db.courses.addActivity(course?.id, section.id, newAct);

		const sectionFound = course?.sections.find(s => s.id === section.id);
		if (!sectionFound || !course) return;

		course.sections = course?.sections.map(s => {
			if (s.id === sectionFound.id)
				s.activities ? s.activities.push(newAct) : (s.activities = [newAct]);
			return s;
		});
		loadActivity(section, newAct);
		setCourse(plainToClass(CourseModel, course));
	};

	const canEdit = course?.creator.id === user?.id;

	const contextValue: CourseContentValues = {
		course,
		section,
		activity,
		canEdit,
		loadActivity,
		addSection,
		addActivity,
		saveActivity,
		saveActivityContent,
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
					<ActivityContent />
				</FillContainer>
			</StyledDiv>
		</CourseContext.Provider>
	);
};

export default Course;