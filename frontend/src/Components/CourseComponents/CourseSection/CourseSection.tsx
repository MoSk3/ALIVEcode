import { CourseSectionProps } from './courseSectionTypes';
import { useState, useContext } from 'react';
import { Collapse } from 'react-bootstrap';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Link from '../../UtilsComponents/Link/Link';
import { Activity } from '../../../Models/Course/activity.entity';
import { plainToClass } from 'class-transformer';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';

/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author MoSk3
 */
const CourseSection = ({ section }: CourseSectionProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { loadActivity, addActivity, course, canEdit } =
		useContext(CourseContext);

	const toggleOpenSection = async () => {
		if (!course) return;
		setOpen(!open);
		if (!open) {
			setLoading(true);
			await section.getActivities(course.id);
			setLoading(false);
		}
	};

	return (
		<div className="course-section">
			<div
				className="course-section-header"
				onClick={toggleOpenSection}
				aria-controls={`section-${section.name}`}
				aria-expanded={open}
			>
				{section.name}
			</div>
			<Collapse in={open} timeout={500}>
				<div id={`section-${section.name}`} className="course-section-body">
					{loading && open && <LoadingScreen size="3x" relative />}

					{canEdit &&
					(!section.activities || section.activities?.length === 0) ? (
						<Link
							dark
							onClick={() => {
								addActivity(
									section,
									plainToClass(Activity, {
										name: `Activity #${
											section.activities ? section.activities.length + 1 : 1
										}`,
									}),
								);
							}}
						>
							Add an activity
						</Link>
					) : (
						<>
							{section.activities?.map((a, idx) => (
								<div
									onClick={() => loadActivity(section, a)}
									key={idx}
									className="course-activity"
								>
									{a.name}
								</div>
							))}
							{canEdit && (
								<Link
									dark
									onClick={() => {
										addActivity(
											section,
											plainToClass(Activity, {
												name: `Activity #${
													section.activities ? section.activities.length + 1 : 1
												}`,
											}),
										);
									}}
								>
									Add an activity
								</Link>
							)}
						</>
					)}
				</div>
			</Collapse>
		</div>
	);
};

export default CourseSection;