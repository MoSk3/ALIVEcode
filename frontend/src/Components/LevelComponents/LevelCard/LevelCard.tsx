import { LevelCardProps, StyledLevelCard } from './levelCardTypes';
import { useHistory } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';

const LevelCard = ({ level, enterEdit }: LevelCardProps) => {
	const history = useHistory();
	const { routes } = useRoutes();

	return (
		<StyledLevelCard
			onClick={() =>
				enterEdit
					? history.push(routes.auth.level_edit.path.replace(':id', level.id))
					: history.push(routes.auth.level_play.path.replace(':id', level.id))
			}
		>
			<div className="content">{level.name}</div>
		</StyledLevelCard>
	);
};

export default LevelCard;