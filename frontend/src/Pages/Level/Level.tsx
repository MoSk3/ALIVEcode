import { LevelProps } from './levelTypes';
import { useEffect, useState } from 'react';
import { Level as LevelModel } from '../../Models/Level/level.entity';
import { useAlert } from 'react-alert';
import LevelAlive from './LevelAlive/LevelAlive';
import { LevelAlive as LevelAliveModel } from '../../Models/Level/levelAlive.entity';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { LevelCode as LevelCodeModel } from '../../Models/Level/levelCode.entity';
import LevelCode from './LevelCode/LevelCode';
import api from '../../Models/api';
import { useHistory } from 'react-router';

const Level = (props: LevelProps) => {
	const [level, setLevel] = useState<LevelModel>();
	const alert = useAlert();
	const history = useHistory();

	useEffect(() => {
		const loadLevel = async () => {
			try {
				const level = await api.db.levels.get(props.match.params.id);
				setLevel(level);
			} catch (err) {
				alert.error('Niveau introuvable');
				history.push('/');
			}
		};
		loadLevel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.id]);

	if (!level) return <LoadingScreen />;

	if (level instanceof LevelAliveModel)
		return <LevelAlive level={level}></LevelAlive>;

	if (level instanceof LevelCodeModel)
		return <LevelCode level={level}></LevelCode>;

	return <></>;
};

export default Level;