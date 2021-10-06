import {
	ActivityContentProps,
	StyledActivityContent,
} from './activityContentTypes';
import { useContext, useState } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import ReactMarkdown from 'react-markdown';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import Level from '../../../Pages/Level/Level';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import MDEditor from '../MDEditor/MDEditor';
import api from '../../../Models/api';

/**
 * Displays the content of the activity in the CourseContext
 *
 * @author MoSk3
 */
const ActivityContent = (props: ActivityContentProps) => {
	const { theme } = useContext(ThemeContext);
	const { activity, course, section } = useContext(CourseContext);
	const [editMode, setEditMode] = useState(false);

	const saveActivityContent = async (content: string) => {
		if (!course || !activity || !section) return;
		const act = await api.db.courses.updateActivity(
			{
				courseId: course.id,
				sectionId: section.id.toString(),
				activityId: activity.id.toString(),
			},
			{
				...activity,
				content: {
					data: content,
				},
			},
		);
		console.log(act);
	};

	return (
		<StyledActivityContent theme={theme}>
			<div className="course-content-padding">
				<div className="course-content">
					{activity ? (
						<>
							<div className="activity-header">
								<div className="activity-header-title">{activity.name}</div>
								<IconButton
									icon={faPencilAlt}
									onClick={() => setEditMode(!editMode)}
									size="2x"
								/>
							</div>
							<div>
								{activity.content?.data ||
								(activity.levels && activity.levels.length > 0) ? (
									<>
										{editMode ? (
											<MDEditor
												onSave={saveActivityContent}
												defaultValue={activity.content?.data}
											></MDEditor>
										) : (
											<>
												{activity.content && (
													<ReactMarkdown>{activity.content.data}</ReactMarkdown>
												)}
												{activity.levels &&
													activity.levels.map((a, idx) => (
														<div key={idx} style={{ position: 'relative' }}>
															<Level
																level={a.level}
																type={a.level.getType()}
																editMode={false}
															></Level>
														</div>
													))}
											</>
										)}
									</>
								) : (
									<p>Empty activity</p>
								)}
							</div>
						</>
					) : (
						<CenteredContainer
							style={{ height: '100%' }}
							horizontally
							vertically
						>
							Open an activity to get started
						</CenteredContainer>
					)}
				</div>
			</div>
		</StyledActivityContent>
	);
};

export default ActivityContent;