import { LevelProps } from './levelTypes';
import { useEffect, useState, useContext } from 'react';
import {
	Level as LevelModel,
	LEVEL_ACCESS,
	LEVEL_DIFFICULTY,
} from '../../Models/Level/level.entity';
import { useAlert } from 'react-alert';
import { LevelAlive as LevelAliveModel } from '../../Models/Level/levelAlive.entity';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { LevelCode as LevelCodeModel } from '../../Models/Level/levelCode.entity';
import LevelCode from './LevelCode/LevelCode';
import api from '../../Models/api';
import { useHistory, useParams } from 'react-router';
import { UserContext } from '../../state/contexts/UserContext';
import { LevelProgression } from '../../Models/Level/levelProgression';
import { plainToClass } from 'class-transformer';
import { User } from '../../Models/User/user.entity';
import LevelAlive from './LevelAlive/LevelAlive';
import useRoutes from '../../state/hooks/useRoutes';

const Level = (props: LevelProps) => {
	const { id } = useParams<{ id: string }>();
	const { user } = useContext(UserContext);
	const [level, setLevel] = useState<LevelModel>();
	const [progression, setProgresion] = useState<LevelProgression>();
	const alert = useAlert();
	const history = useHistory();
	const { routes } = useRoutes();

	useEffect(() => {
		const loadLevel = async () => {
			let level: LevelModel;

			if (id) {
				try {
					level = await api.db.levels.get(id);
				} catch (err) {
					alert.error('Niveau introuvable');
					history.push('/');
					return;
				}
				if (user) {
					let progression;
					try {
						progression = await api.db.levels.progressions.get(level.id, user);
					} catch {
						progression = plainToClass(LevelProgression, {
							data: {},
						});
					}
					setProgresion(progression);
				}
			} else {
				level = {
					id: 'dummy',
					name: 'New level',
					creator: plainToClass(User, {
						id: 'dummy',
						email: 'dummy@gmail.com',
					}),
					access: LEVEL_ACCESS.RESTRICTED,
					difficulty: LEVEL_DIFFICULTY.EASY,
					hints: [],
					tags: [],
					creationDate: new Date(),
					updateDate: new Date(),
				};
			}
			setLevel(level);
		};
		loadLevel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (!level) return <LoadingScreen />;

	if (level instanceof LevelAliveModel || props.type === 'ALIVE')
		return (
			<LevelAlive
				setLevel={setLevel}
				level={level as LevelAliveModel}
				progression={progression}
				setProgression={setProgresion}
				editMode={
					props.editMode && user != null && level.creator.id === user.id
				}
			></LevelAlive>
		);

	if (level instanceof LevelCodeModel || props.type === 'code')
		return (
			<LevelCode
				setLevel={setLevel}
				level={level as LevelCodeModel}
				progression={progression}
				setProgression={setProgresion}
				editMode={
					props.editMode && user != null && level.creator.id === user.id
				}
			></LevelCode>
		);

	history.push(routes.public.home.path);
	return <></>;
};

export default Level;