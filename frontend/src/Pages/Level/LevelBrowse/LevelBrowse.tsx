import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { LevelBrowseProps } from './levelBrowseTypes';
import { useState, useEffect } from 'react';
import { Level } from '../../../Models/Level/level.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import api from '../../../Models/api';
import Link from '../../../Components/UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';

const LevelBrowse = (props: LevelBrowseProps) => {
	const [levels, setLevels] = useState<Array<Level>>();
	const { routes } = useRoutes();

	useEffect(() => {
		const getLevels = async () => {
			const levels = await api.db.levels.query();
			setLevels(levels);
		};
		getLevels();
	}, []);

	return (
		<CenteredContainer vertically horizontally>
			{!levels ? (
				<LoadingScreen />
			) : (
				<>
					{levels.map(l => (
						<Link to={routes.auth.level_play.path.replace(':id', l.id)}>
							{l.name}
						</Link>
					))}
				</>
			)}
		</CenteredContainer>
	);
};

export default LevelBrowse;