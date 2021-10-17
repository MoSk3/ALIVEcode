import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import {
	CourseNavigationProps,
	StyledCourseNavigation,
} from './courseNavigationTypes';
import { useContext, useState } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import CourseSection from '../CourseSection/CourseSection';
import useRoutes from '../../../state/hooks/useRoutes';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import Link from '../../UtilsComponents/Link/Link';
import FormModal from '../../UtilsComponents/FormModal/FormModal';
import Form from '../../UtilsComponents/Form/Form';
import { Section } from '../../../Models/Course/section.entity';
import { plainToClass } from 'class-transformer';

/**
 * Navigation menu of a course containing all the sections and activities
 *
 * @author MoSk3
 */
const CourseNavigation = (props: CourseNavigationProps) => {
	const { course, addSection, canEdit, isNavigationOpen } =
		useContext(CourseContext);
	const { theme } = useContext(ThemeContext);
	const { routes, goTo } = useRoutes();

	const [openModalSection, setOpenModalSection] = useState(false);

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<StyledCourseNavigation isNavigationOpen={isNavigationOpen} theme={theme}>
			<CenteredContainer horizontally>
				<div className="course-nav-header">
					<div className="course-nav-title">{course?.name}</div>
				</div>
				<div className="course-nav-body">
					{course.sections.length > 0 ? (
						<>
							{course.sections.map((s, idx) => (
								<CourseSection key={idx} section={s} />
							))}
							{canEdit && (
								<Link
									style={{ textAlign: 'center' }}
									onClick={() => setOpenModalSection(true)}
									dark
									block
								>
									New section
								</Link>
							)}
						</>
					) : (
						<div style={{ textAlign: 'center' }}>
							<label>There are no sections in this course</label>
							{canEdit && (
								<Link onClick={() => setOpenModalSection(true)} dark block>
									New section
								</Link>
							)}
						</div>
					)}
				</div>
			</CenteredContainer>
			<FormModal
				open={openModalSection}
				title="Create section"
				onClose={() => setOpenModalSection(false)}
				onSubmit={res => {
					const section: Section = plainToClass(Section, res.data);
					addSection(section);
					setOpenModalSection(false);
				}}
			>
				<Form
					name="section"
					url={`courses/${course.id}/sections`}
					action="POST"
					inputGroups={[
						{
							name: 'name',
							inputType: 'text',
							required: true,
							minLength: 3,
							maxLength: 100,
						},
					]}
				/>
			</FormModal>
		</StyledCourseNavigation>
	);
};

export default CourseNavigation;