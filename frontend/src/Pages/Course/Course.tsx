import styled from 'styled-components';
import { CourseProps } from './courseTypes';
import CourseModel, { Activity, Section } from '../../Models/Playground/Course';
import CourseNavigation from '../../Components/CourseComponents/CourseNavigation/CourseNavigation';
import FillContainer from '../../Components/UtilsComponents/FillContainer/FillContainer';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import { User } from '../../Models/User';
import {
	COURSE_ACCESS,
	COURSE_DIFFICULTY,
	COURSE_SUBJECT,
} from '../../Types/Playground/courseType';
import { CourseContext } from '../../state/contexts/CourseContext';
import CourseContent from '../../Components/CourseComponents/CourseContent/CourseContent';

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
		const course = new CourseModel({
			id: 'a',
			name: 'Cours de programmation',
			description: 'lol cours',
			creator: user as User,
			subject: COURSE_SUBJECT.INFORMATIC,
			difficulty: COURSE_DIFFICULTY.debutant,
			access: COURSE_ACCESS.PU,
			code: '123456',
			sections: [
				new Section('LOL', [
					new Activity('COOOOOOL'),
					new Activity('mouahahah'),
				]),
				new Section('Section pog!', [
					new Activity('yeppp'),
					new Activity('mouahahah'),
				]),
				new Section('poggers', [new Activity('tg'), new Activity('you smell')]),
			],
		});
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