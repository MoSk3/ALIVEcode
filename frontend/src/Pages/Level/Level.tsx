import { LevelProps, typeAskForUserInput } from './levelTypes';
import { useEffect, useState, useContext, useRef } from 'react';
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
import { LevelAI as LevelAIModel } from '../../Models/Level/levelAI.entity';
import LevelAI from './LevelAI/LevelAI';
import Modal from '../../Components/UtilsComponents/Modal/Modal';
import { useTranslation } from 'react-i18next';

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
	const [progression, setProgression] = useState<LevelProgression>();
	const [initialProgressionCode, setInitialProgressionCode] =
		useState<string>('');
	const alert = useAlert();
	const history = useHistory();
	const { t } = useTranslation();
	const userInputRef = useRef<any>();
	const userInputCallback = useRef<(inputValue: string) => void>();
	const inputMsg = useRef<string>(t('input.defaultMessage'));
	const [userInputModalOpen, setUserInputModalOpen] = useState(false);

	const askForUserInput: typeAskForUserInput = (msg, callback) => {
		userInputCallback.current = callback;
		inputMsg.current = msg;
		setUserInputModalOpen(true);
	};

	useEffect(() => {
		setInitialProgressionCode('');
		setLevel(undefined);

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
			if (user && (levelProp || fetchedLevel)) {
				let progression: LevelProgression;
				const currentLevel = levelProp ?? fetchedLevel;
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
				progression.data.code &&
					setInitialProgressionCode(progression.data.code);
				setProgression(progression);
				setLevel(currentLevel);
			}

			// If no level loaded create an non-saved empty one
			if (!level && !fetchedLevel && !levelProp) {
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
	}, [levelId, levelProp]);

	if (!level || !progression) return <LoadingScreen />;

	return (
		<>
			{level instanceof LevelAliveModel ? (
				<LevelAlive
					initialCode={
						initialProgressionCode || (level as LevelAliveModel).initialCode
					}
					setLevel={setLevel}
					level={level as LevelAliveModel}
					progression={progression}
					setProgression={setProgression}
					editMode={
						props.editMode &&
						user != null &&
						level.creator != null &&
						level.creator.id === user.id
					}
					askForUserInput={askForUserInput}
				></LevelAlive>
			) : level instanceof LevelCodeModel ? (
				<LevelCode
					initialCode={
						initialProgressionCode || (level as LevelCodeModel).initialCode
					}
					setLevel={setLevel}
					level={level as LevelCodeModel}
					progression={progression}
					setProgression={setProgression}
					editMode={
						props.editMode &&
						user != null &&
						level.creator != null &&
						level.creator.id === user.id
					}
					askForUserInput={askForUserInput}
				></LevelCode>
			) : level instanceof LevelAIModel ? (
				<LevelAI
					initialCode={
						initialProgressionCode || (level as LevelAIModel).initialCode
					}
					setLevel={setLevel}
					level={level as LevelAIModel}
					progression={progression}
					setProgression={setProgression}
					editMode={
						props.editMode &&
						user != null &&
						level.creator != null &&
						level.creator.id === user.id
					}
				></LevelAI>
			) : (
				<LoadingScreen></LoadingScreen>
			)}
			<Modal
				open={userInputModalOpen}
				onClose={() => {
					if (userInputCallback.current && userInputRef.current)
						userInputCallback.current(`${userInputRef.current.value}`);
					setUserInputModalOpen(false);
					userInputRef.current.value = '';
				}}
				title={inputMsg.current}
				hideCloseButton
				submitText="Confirmer"
				centered
				onShow={() => userInputRef.current.focus()}
				centeredText
			>
				<input
					ref={userInputRef}
					placeholder={`${t('input.defaultValue')}`}
					type="text"
					onKeyPress={e => {
						if (e.key === 'Enter') {
							e.preventDefault();
							if (userInputCallback.current && userInputRef.current)
								userInputCallback.current(
									`${userInputRef.current?.value ?? ''}`,
								);
							userInputRef.current.value = '';
							setUserInputModalOpen(false);
						}
					}}
				/>
			</Modal>
		</>
	);
	/*
	if (level instanceof LevelAliveModel) {
		return (
			<LevelAlive
				initialCode={
					initialProgressionCode || (level as LevelAliveModel).initialCode
				}
				setLevel={setLevel}
				level={level as LevelAliveModel}
				progression={progression}
				setProgression={setProgression}
				editMode={
					props.editMode &&
					user != null &&
					level.creator != null &&
					level.creator.id === user.id
				}
			></LevelAlive>
		);
	}

	if (level instanceof LevelCodeModel) {
		return (
			<LevelCode
				initialCode={
					initialProgressionCode || (level as LevelCodeModel).initialCode
				}
				setLevel={setLevel}
				level={level as LevelCodeModel}
				progression={progression}
				setProgression={setProgression}
				editMode={
					props.editMode &&
					user != null &&
					level.creator != null &&
					level.creator.id === user.id
				}
			></LevelCode>
		);
	}

	if (level instanceof LevelAIModel)
		return (
			<LevelAI
				initialCode={
					initialProgressionCode || (level as LevelAIModel).initialCode
				}
				setLevel={setLevel}
				level={level as LevelAIModel}
				progression={progression}
				setProgression={setProgression}
				editMode={
					props.editMode &&
					user != null &&
					level.creator != null &&
					level.creator.id === user.id
				}
			></LevelAI>
		);

	return <LoadingScreen></LoadingScreen>;
	*/
};

export default Level;