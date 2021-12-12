import { ClassroomSectionProps } from './classroomSectionTypes';
import { useState, useEffect } from 'react';
import {
	faAngleDown,
	faAngleUp,
	faCalculator,
	faCode,
	faFlask,
	faProjectDiagram,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import CourseSection from '../CourseSection/CourseSection';
import { CLASSROOM_SUBJECT } from '../../../Models/Classroom/classroom.entity';
import { formatTooLong } from '../../../Types/formatting';

const ClassroomSection = ({
	classroom,
	onClick,
	selected,
}: ClassroomSectionProps) => {
	const [isHovering, setIsHovering] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const forceUpdate = useForceUpdate();

	let icon = faCode;
	switch (classroom.subject) {
		case CLASSROOM_SUBJECT.INFORMATIC:
			icon = faCode;
			break;
		case CLASSROOM_SUBJECT.SCIENCE:
			icon = faFlask;
			break;
		case CLASSROOM_SUBJECT.MATH:
			icon = faCalculator;
			break;
		case CLASSROOM_SUBJECT.AI:
			icon = faProjectDiagram;
			break;
	}

	useEffect(() => {
		if (isOpen && !classroom.courses) {
			const loadCourses = async () => {
				await classroom.getCourses();
				forceUpdate();
			};

			loadCourses();
		}
	}, [classroom, forceUpdate, isOpen]);

	return (
		<>
			<div
				className={'sidebar-classroom ' + (selected ? 'sidebar-selected' : '')}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onClick={onClick}
			>
				<FontAwesomeIcon className="sidebar-icon" icon={icon} />
				<label className="sidebar-classroom-text">
					{formatTooLong(classroom.name, 25)}
				</label>
				{isHovering && (
					<FontAwesomeIcon
						className="sidebar-icon-right"
						onClick={e => {
							e.stopPropagation();
							setIsOpen(!isOpen);
						}}
						icon={isOpen ? faAngleUp : faAngleDown}
					/>
				)}
			</div>
			{isOpen &&
				(classroom.courses && classroom.courses?.length > 0 ? (
					classroom.courses.map((course, idx) => (
						<CourseSection key={idx} course={course}></CourseSection>
					))
				) : (
					<div className="sidebar-course sidebar-course-text">
						<i>No Courses</i>
					</div>
				))}
			<hr />
		</>
	);
};

export default ClassroomSection;
