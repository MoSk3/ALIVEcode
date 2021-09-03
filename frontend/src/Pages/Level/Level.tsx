import { LevelProps } from './levelTypes';
import { useEffect, useState, useContext } from 'react';
import { Level as LevelModel } from '../../Models/Level/level.entity';
import { useAlert } from 'react-alert';
import LevelAlive from './LevelAlive/LevelAlive';
import { LevelAlive as LevelAliveModel } from '../../Models/Level/levelAlive.entity';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { LevelCode as LevelCodeModel } from '../../Models/Level/levelCode.entity';
import LevelCode from './LevelCode/LevelCode';
import api from '../../Models/api';
import { useHistory, useParams } from 'react-router';
import { UserContext } from '../../state/contexts/UserContext';

const Level = (props: LevelProps) => {
	const { id } = useParams<{ id: string }>();
	const { user } = useContext(UserContext);
	const [level, setLevel] = useState<LevelModel>();
	const alert = useAlert();
	const history = useHistory();

	useEffect(() => {
		const loadLevel = async () => {
			try {
				const level = await api.db.levels.get(id);
				setLevel(level);
			} catch (err) {
				alert.error('Niveau introuvable');
				history.push('/');
			}
		};
		loadLevel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (!level || !user) return <LoadingScreen />;

	if (level instanceof LevelAliveModel)
		return (
			<LevelAlive
				level={level}
				editMode={props.editMode && level.creator.id === user.id}
			></LevelAlive>
		);

	if (level instanceof LevelCodeModel)
		return (
			<LevelCode
				level={level}
				editMode={props.editMode && level.creator.id === user.id}
			></LevelCode>
		);

	return <></>;
};

export default Level;