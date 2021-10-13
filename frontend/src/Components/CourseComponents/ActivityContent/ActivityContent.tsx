import {
	ActivityContentProps,
	StyledActivityContent,
} from './activityContentTypes';
import { useContext, useState, useEffect } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import ReactMarkdown from 'react-markdown';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import Level from '../../../Pages/Level/Level';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { faCheckCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import MDEditor from '../MDEditor/MDEditor';
import { Form } from 'react-bootstrap';

/**
 * Displays the content of the activity in the CourseContext
 *
 * @author MoSk3
 */
const ActivityContent = (props: ActivityContentProps) => {
	const { theme } = useContext(ThemeContext);
	const { activity, saveActivityContent, saveActivity, canEdit } =
		useContext(CourseContext);
	const [editMode, setEditMode] = useState(false);
	const [name, setName] = useState<string>('');
	const [editingName, setEditingName] = useState(false);
	const [defaultMDValue, setDefaultMDValue] = useState<string>();

	useEffect(() => {
		activity && setName(activity.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.name]);

	useEffect(() => {
		setDefaultMDValue(activity?.content?.data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.content?.data]);

	return (
		<StyledActivityContent theme={theme}>
			<div className="activity-content-padding">
				<div className="activity-content-body">
					{activity ? (
						<>
							<div
								className="activity-header"
								style={{ cursor: editMode ? 'pointer' : 'initial' }}
							>
								{!editingName ? (
									<div
										className="activity-header-title"
										onClick={() => editMode && setEditingName(true)}
									>
										{activity.name}
									</div>
								) : (
									<Form.Control
										className="activity-header-title"
										value={name}
										onChange={e => setName(e.target.value)}
										onBlur={() => {
											activity.name = name;
											saveActivity(activity);
											setEditingName(false);
										}}
										onKeyDown={(e: any) => {
											if (e.keyCode === 13) {
												activity.name = name;
												saveActivity(activity);
												setEditingName(false);
											}
										}}
									/>
								)}
								{canEdit && (
									<IconButton
										icon={editMode ? faCheckCircle : faPencilAlt}
										onClick={() => setEditMode(!editMode)}
										size="2x"
									/>
								)}
							</div>
							<div>
								{canEdit && editMode ? (
									<MDEditor
										onSave={saveActivityContent}
										defaultValue={defaultMDValue}
									/>
								) : activity.content?.data ||
								  (activity.levels && activity.levels.length > 0) ? (
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