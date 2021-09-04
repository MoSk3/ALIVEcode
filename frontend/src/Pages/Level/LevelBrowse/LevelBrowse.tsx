import { LevelBrowseProps } from './levelBrowseTypes';
import { useState, useEffect } from 'react';
import { Level } from '../../../Models/Level/level.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import api from '../../../Models/api';
import LevelCard from '../../../Components/LevelComponents/LevelCard/LevelCard';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';

const LevelBrowse = (props: LevelBrowseProps) => {
	const [levels, setLevels] = useState<Array<Level>>();

	useEffect(() => {
		const getLevels = async () => {
			const levels = await api.db.levels.query();
			setLevels(levels);
		};
		getLevels();
	}, []);

	return (
		<CardContainer title="Users's levels">
			{!levels ? (
				<LoadingScreen />
			) : (
				<>
					{levels.map((l, idx) => (
						<LevelCard level={l} key={idx} />
					))}
				</>
			)}
		</CardContainer>
	);
};

export default LevelBrowse;