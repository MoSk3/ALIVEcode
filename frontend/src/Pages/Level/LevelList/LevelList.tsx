import { useEffect, useContext, useState } from 'react';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { LevelListProps } from './levelListTypes';
import { UserContext } from '../../../state/contexts/UserContext';
import { useHistory } from 'react-router-dom';
import api from '../../../Models/api';
import { Level } from '../../../Models/Level/level.entity';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import LevelCard from '../../../Components/LevelComponents/LevelCard/LevelCard';
import { LevelAlive } from '../../../Models/Level/levelAlive.entity';
import { LevelCode } from '../../../Models/Level/levelCode.entity';

const LevelList = (props: LevelListProps) => {
	const [levels, setLevels] = useState<Array<LevelAlive | LevelCode | Level>>();
	const { user } = useContext(UserContext);
	const history = useHistory();

	useEffect(() => {
		if (!user) return;
		const getLevels = async () => {
			const levels = await api.db.users.getLevels(user?.id);
			setLevels(levels);
		};
		getLevels();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!user) {
		history.push('/');
		return <></>;
	}

	return (
		<CardContainer title="Mes niveaux">
			{!levels ? (
				<LoadingScreen />
			) : (
				<>
					{levels.map((l, idx) => (
						<LevelCard enterEdit level={l} key={idx} />
					))}
				</>
			)}
		</CardContainer>
	);
};

export default LevelList;