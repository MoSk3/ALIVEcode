import styled from 'styled-components';
import { CourseProps } from './courseTypes';
import CourseNavigation from '../../Components/CourseComponents/CourseNavigation/CourseNavigation';
import FillContainer from '../../Components/UtilsComponents/FillContainer/FillContainer';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import {
	COURSE_ACCESS,
	COURSE_DIFFICULTY,
	COURSE_SUBJECT,
} from '../../Types/Playground/courseType';
import { CourseContext } from '../../state/contexts/CourseContext';
import CourseContent from '../../Components/CourseComponents/CourseContent/CourseContent';
import { Course as CourseModel } from '../../Models/Course/course.entity';

const StyledDiv = styled.div`
	.course-body {
	}
`;

const Course = (props: CourseProps) => {
	const { user } = useContext(UserContext);
	const [course, setCourse] = useState<CourseModel>();

	const loadActivity = (id: string) => {
		return id;
	};

	const contextValue = {
		course,
		loadActivity,
	};

	useEffect(() => {
		const course: CourseModel = {
			id: 'a',
			name: 'Cours de programmation',
			description: 'lol cours',
			creator: user,
			subject: COURSE_SUBJECT.INFORMATIC,
			difficulty: COURSE_DIFFICULTY.BEGINNER,
			access: COURSE_ACCESS.PUBLIC,
			code: '123456',
		} as CourseModel;
		setCourse(course);
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