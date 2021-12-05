import { CourseSectionProps } from './courseSectionTypes';
import { useState, useContext } from 'react';
import { Collapse } from 'react-bootstrap';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Link from '../../UtilsComponents/Link/Link';
import { Activity } from '../../../Models/Course/activity.entity';
import { plainToClass } from 'class-transformer';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { useTranslation } from 'react-i18next';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import FormModal from '../../UtilsComponents/FormModal/FormModal';
import Modal from '../../UtilsComponents/Modal/Modal';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import api from '../../../Models/api';
/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author MoSk3
 */
const CourseSection = ({ section, editMode }: CourseSectionProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { loadActivity, addActivity, course, canEdit, deleteSection } =
		useContext(CourseContext);
	const { t } = useTranslation();
	const [confirmSectionDelete, setConfirmSectionDelete] = useState(false);

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
			<div className="course-section-header-edit">
				<div
					className="course-section-header"
					aria-controls={`section-${section.name}`}
					aria-expanded={open}
					onClick={toggleOpenSection}
				>
					<span>{section.name}</span>
				</div>
				{canEdit && editMode && (
					<IconButton
						icon={faTrash}
						color="red"
						size="1x"
						onClick={() => setConfirmSectionDelete(true)}
					/>
				)}
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
												name: t('course.activity.new_name', {
													num: section.activities
														? section.activities.length + 1
														: 1,
												}),
											}),
										);
									}}
								>
									{t('course.activity.new')}
								</Link>
							)}
						</>
					)}
				</div>
			</Collapse>
			<AlertConfirm
				open={confirmSectionDelete}
				title={t('couse.section.delete')}
				onClose={() => setConfirmSectionDelete(false)}
				onConfirm={() => {
					if (!(course && section)) return;
					deleteSection(section);
				}}
				hideFooter
			></AlertConfirm>
		</div>
	);
};

export default CourseSection;