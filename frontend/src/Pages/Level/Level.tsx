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
import LevelAlive from './LevelAlive/LevelAlive';
import useRoutes from '../../state/hooks/useRoutes';
import { LevelAI as LevelAIModel } from '../../Models/Level/levelAI.entity';
import LevelAI from './LevelAI/LevelAI';

const Level = ({ level: levelProp, ...props }: LevelProps) => {
	const { levelId } = useParams<{ levelId: string }>();
	const { user } = useContext(UserContext);
	const [level, setLevel] = useState<LevelModel | undefined>(() => levelProp);
	const [progression, setProgresion] = useState<LevelProgression>();
	const alert = useAlert();
	const history = useHistory();
	const { routes } = useRoutes();

	useEffect(() => {
		const loadLevel = async () => {
			let fetchedLevel: LevelModel | null = null;

			// LevelId as url param
			if (levelId) {
				try {
					fetchedLevel = await api.db.levels.get({ id: levelId });
				} catch (err) {
					alert.error('Niveau introuvable');
					history.push('/');
					return;
				}
			}

			// If user, load or create progression
			if (user && (level || fetchedLevel)) {
				let progression: LevelProgression;
				const currentLevel = level ?? fetchedLevel;
				if (!currentLevel) return;
				try {
					progression = await api.db.levels.progressions.get({
						id: currentLevel.id,
						userId: user.id,
					});
				} catch (err) {
					progression = await api.db.levels.progressions.save(
						{
							id: currentLevel.id,
							userId: user.id,
						},
						currentLevel,
					);
				}
				setProgresion(progression);
			}

			// If no level loaded create an non-saved empty one
			if (!level && !fetchedLevel) {
				fetchedLevel = plainToClass(LevelModel, {
					id: 'dummy',
					name: 'New level',
					creator: {
						id: 'dummy',
						email: 'dummy@gmail.com',
					},
					access: LEVEL_ACCESS.RESTRICTED,
					difficulty: LEVEL_DIFFICULTY.EASY,
					hints: [],
					tags: [],
					creationDate: new Date(),
					updateDate: new Date(),
				});
				console.log(fetchedLevel);
			}
			fetchedLevel && setLevel(fetchedLevel);
		};
		loadLevel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [levelId]);

	if (!level || !progression) return <LoadingScreen />;

	if (level instanceof LevelAliveModel || props.type === 'ALIVE')
		return (
			<LevelAlive
				setLevel={setLevel}
				level={level as LevelAliveModel}
				progression={progression}
				setProgression={setProgresion}
				editMode={
					props.editMode &&
					user != null &&
					level.creator != null &&
					level.creator.id === user.id
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
					props.editMode &&
					user != null &&
					level.creator != null &&
					level.creator.id === user.id
				}
			></LevelCode>
		);

	if (level instanceof LevelAIModel || props.type === 'ai')
		return (
			<LevelAI
				setLevel={setLevel}
				level={level as LevelAIModel}
				progression={progression}
				setProgression={setProgresion}
				editMode={
					props.editMode &&
					user != null &&
					level.creator != null &&
					level.creator.id === user.id
				}
			></LevelAI>
		);

	history.push(routes.public.home.path);
	return <></>;
};

export default Level;