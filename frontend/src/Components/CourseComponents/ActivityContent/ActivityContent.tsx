import {
	ActivityContentProps,
	StyledActivityContent,
} from './activityContentTypes';
import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import ReactMarkdown from 'react-markdown';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import Level from '../../../Pages/Level/Level';

/**
 * Displays the content of the activity in the CourseContext
 *
 * @author MoSk3
 */
const ActivityContent = (props: ActivityContentProps) => {
	const { theme } = useContext(ThemeContext);
	const { activity } = useContext(CourseContext);

	return (
		<StyledActivityContent theme={theme}>
			<div className="course-content-padding">
				<div className="course-content">
					{activity ? (
						<>
							<h1>{activity.name}</h1>
							<div>
								{activity.content?.data ||
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