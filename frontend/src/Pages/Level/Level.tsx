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

/**
 * This component is used to load any type of Level with an id or passed as a prop.
 * It automatically loads the progression or create a new one.
 * It also renders the correct Level component depending on the type specified.
 *
 * @param {boolean} editMode if the level is in editMode
 * @param {Level} level level to load (optional if specified in url parameters)
 * @param {string} type type of the level to load: AI, ALIVE, IoT, code
 *
 * @author MoSk3
 */
const Level = ({ level: levelProp, ...props }: LevelProps) => {
	const { levelId } = useParams<{ levelId: string }>();
	const { user } = useContext(UserContext);
	const [level, setLevel] = useState<LevelModel | undefined>(() => levelProp);
	const [progression, setProgresion] = useState<LevelProgression>();
	const [initialCode, setInitialCode] = useState<string>('');
	const alert = useAlert();
	const history = useHistory();
	const { routes } = useRoutes();

	useEffect(() => {
		setLevel(levelProp);
	}, [levelProp]);

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
				progression.data.code && setInitialCode(progression.data.code);
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
			}
			fetchedLevel && setLevel(fetchedLevel);
		};
		loadLevel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [levelId, level]);

	if (!level || !progression) return <LoadingScreen />;

	if (level instanceof LevelAliveModel || props.type === 'ALIVE') {
		return (
			<LevelAlive
				initialCode={initialCode}
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
	}

	if (level instanceof LevelCodeModel || props.type === 'code')
		return (
			<LevelCode
				initialCode={initialCode}
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

	if (level instanceof LevelAIModel || props.type === 'AI')
		return (
			<LevelAI
				initialCode={initialCode}
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