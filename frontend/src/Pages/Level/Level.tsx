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
import { LevelProgression } from '../../Models/Level/levelProgression';
import { plainToClass } from 'class-transformer';

const Level = (props: LevelProps) => {
	const { id } = useParams<{ id: string }>();
	const { user } = useContext(UserContext);
	const [level, setLevel] = useState<LevelModel>();
	const [progression, setProgresion] = useState<LevelProgression>();
	const alert = useAlert();
	const history = useHistory();

	useEffect(() => {
		if (!user) return;
		const loadLevel = async () => {
			let level;

			try {
				level = await api.db.levels.get(id);
			} catch (err) {
				alert.error('Niveau introuvable');
				history.push('/');
				return;
			}

			let progression;
			try {
				progression = await api.db.levels.progressions.get(level.id, user);
			} catch {
				progression = plainToClass(LevelProgression, {
					data: {},
				});
			}
			setProgresion(progression);
			setLevel(level);
		};
		loadLevel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (!level || !user || !progression) return <LoadingScreen />;

	if (level instanceof LevelAliveModel)
		return (
			<LevelAlive
				setLevel={setLevel}
				level={level}
				progression={progression}
				setProgression={setProgresion}
				editMode={props.editMode && level.creator.id === user.id}
			></LevelAlive>
		);

	if (level instanceof LevelCodeModel)
		return (
			<LevelCode
				setLevel={setLevel}
				level={level}
				progression={progression}
				setProgression={setProgresion}
				editMode={props.editMode && level.creator.id === user.id}
			></LevelCode>
		);

	return <></>;
};

export default Level;