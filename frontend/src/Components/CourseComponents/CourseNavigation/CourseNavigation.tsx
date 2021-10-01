import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import { CourseNavigationProps, StyledDiv } from './courseNavigationTypes';
import { useContext, useState } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import CourseSection from '../CourseSection/CourseSection';
import useRoutes from '../../../state/hooks/useRoutes';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import Link from '../../UtilsComponents/Link/Link';
import { UserContext } from '../../../state/contexts/UserContext';
import FormModal from '../../UtilsComponents/FormModal/FormModal';
import Form from '../../UtilsComponents/Form/Form';

const CourseNavigation = (props: CourseNavigationProps) => {
	const { course } = useContext(CourseContext);
	const { theme } = useContext(ThemeContext);
	const { user } = useContext(UserContext);
	const { routes, goTo } = useRoutes();

	const [openModalSection, setOpenModalSection] = useState(false);

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<StyledDiv theme={theme}>
			<CenteredContainer horizontally>
				<div className="course-nav-header">
					<div className="course-nav-title">{course?.name}</div>
				</div>
				<div className="course-nav-body">
					{course.sections.length > 0 ? (
						course.sections.map((s, idx) => (
							<CourseSection key={idx} section={s} />
						))
					) : (
						<div style={{ textAlign: 'center' }}>
							<label>There are no sections in this course</label>
							{user?.id === course.creator.id && (
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
				onSubmit={res => console.log(res)}
			>
				<Form
					name="section"
					url={`courses/${course.id}/sections`}
					action="POST"
					inputGroups={[
						{
							name: 'name',
							inputType: 'text',
						},
					]}
				/>
			</FormModal>
		</StyledDiv>
	);
};

export default CourseNavigation;