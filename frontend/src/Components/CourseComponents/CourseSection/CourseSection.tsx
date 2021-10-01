import { CourseSectionProps } from './courseSectionTypes';
import { useState, useContext } from 'react';
import { Collapse } from 'react-bootstrap';
import { CourseContext } from '../../../state/contexts/CourseContext';

const CourseSection = ({ section }: CourseSectionProps) => {
	const [open, setOpen] = useState(false);
	const { loadActivity } = useContext(CourseContext);

	const handleLoadActivity = () => {
		console.log(loadActivity('a'));
	};

	return (
		<div className="course-section">
			<div
				className="course-section-header"
				onClick={() => setOpen(!open)}
				aria-controls={`section-${section.name}`}
				aria-expanded={open}
			>
				{section.name}
			</div>
			<Collapse in={open} timeout={500}>
				<div id={`section-${section.name}`} className="course-section-body">
					{section.activities?.map((a, idx) => (
						<div
							onClick={handleLoadActivity}
							key={idx}
							className="course-activity"
						>
							{a.name}
						</div>
					))}
				</div>
			</Collapse>
		</div>
	);
};

export default CourseSection;