import { LevelAliveProps, StyledAliveLevel } from './levelAliveTypes';
import { useEffect, useState, useContext, useRef } from 'react';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Simulation from '../../../Components/LevelComponents/Simulation/Simulation';
import { Row, Col } from 'react-bootstrap';
import {
	faBookOpen,
	faCog,
	faPencilAlt,
	faPlayCircle,
	faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../../Components/DashboardComponents/IconButton/IconButton';
import Cmd from '../../../Components/LevelComponents/Cmd/Cmd';
import LevelAliveExecutor from './LevelAliveExecutor';
import useCmd from '../../../state/hooks/useCmd';
import { Professor } from '../../../Models/User/user.entity';
import { useHistory } from 'react-router-dom';
import useRoutes from '../../../state/hooks/useRoutes';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import FormModal from '../../../Components/UtilsComponents/FormModal/FormModal';
import Form from '../../../Components/UtilsComponents/Form/Form';
import { plainToClass } from 'class-transformer';
import { LevelAlive as LevelAliveModel } from '../../../Models/Level/levelAlive.entity';
import api from '../../../Models/api';
import {
	LEVEL_ACCESS,
	LEVEL_DIFFICULTY,
} from '../../../Models/Level/level.entity';
import $ from 'jquery';
import { useTranslation } from 'react-i18next';

const LevelAlive = ({
	level,
	editMode,
	progression,
	setLevel,
	setProgression,
}: LevelAliveProps) => {
	const { user } = useContext(UserContext);
	const [executor, setExecutor] = useState<LevelAliveExecutor>();
	const [cmdRef, cmd] = useCmd();
	const playButton = useRef<HTMLButtonElement>(null);
	const history = useHistory();
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const [editTitle, setEditTitle] = useState(false);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const saveTimeout = useRef<any>(null);
	const messageTimeout = useRef<any>(null);

	const lineInterfaceContentChanges = (content: any) => {
		if (executor) executor.lineInterfaceContent = content;
		if (!editMode) {
			progression.data.code = content;
			const updatedProgression = progression;
			setProgression(updatedProgression);
			saveProgressionTimed();
		}
	};

	useEffect(() => {
		if (cmd && executor) executor.cmd = cmd;
	}, [cmd, executor]);

	useEffect(() => {
		if (!user || (editMode && level.creator.id !== user.id))
			return history.push(routes.public.home.path);

		if (!playButton.current) return;
		setExecutor(
			new LevelAliveExecutor(
				user ?? ({} as Professor),
				level.name,
				playButton.current,
			),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, level]);

	const saveLevel = async () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);
		const updatedLevel = (await api.db.levels.update(level)) as LevelAliveModel;
		messageTimeout.current = setTimeout(() => {
			setSaving(false);
			setSaved(true);

			messageTimeout.current = setTimeout(() => {
				setSaved(false);
			}, 5000);
		}, 500);
		setLevel(updatedLevel);
	};

	const saveLevelTimed = () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveLevel, 2000);
	};

	const saveProgression = async () => {
		if (!user) return;
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);
		const updatedProgression = await api.db.levels.progressions.save(
			level.id,
			user,
			progression,
		);
		messageTimeout.current = setTimeout(() => {
			setSaving(false);
			setSaved(true);

			messageTimeout.current = setTimeout(() => {
				setSaved(false);
			}, 5000);
		}, 500);
		setProgression(updatedProgression);
	};

	const saveProgressionTimed = () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveProgression, 2000);
	};

	useEffect(() => {
		$(document).on('keydown', e => {
			if (e.keyCode === 83 && e.ctrlKey) {
				e.preventDefault();
				e.stopPropagation();
				editMode ? saveLevel() : saveProgression();
			}
		});

		return () => {
			clearTimeout(saveTimeout.current);
			clearTimeout(messageTimeout.current);
			$(document).off('keydown');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (!user) return <LoadingScreen />;

	return (
		<StyledAliveLevel editMode={editMode}>
			<Row className="h-100">
				<Col className="left-col" md={6}>
					<div className="tools-bar">
						{editMode && editTitle ? (
							<input
								type="text"
								autoFocus
								onBlur={() => setEditTitle(false)}
								defaultValue={level.name}
							/>
						) : (
							<label
								className="level-title"
								onClick={() => editMode && setEditTitle(true)}
							>
								{level ? level.name : 'Sans nom'}
							</label>
						)}
						{editMode && (
							<>
								<IconButton
									onClick={() => setSettingsModalOpen(true)}
									icon={faCog}
									size="2x"
								/>
							</>
						)}
						{!editMode && user.id === level.creator.id && (
							<IconButton
								to={routes.auth.level_edit.path.replace(':id', level.id)}
								icon={faPencilAlt}
								size="2x"
							/>
						)}
						<IconButton icon={faBookOpen} size="2x" />
						<IconButton icon={faQuestionCircle} size="2x" />
						<IconButton icon={faPlayCircle} size="2x" ref={playButton} />
						{(saving || saved) && (
							<label className="save-message">
								{saving && 'Sauvegarde en cours...'}
								{saved && 'Niveau sauvegardé ✔'}
							</label>
						)}
					</div>
					{editMode ? (
						<LineInterface
							hasTabs
							tabs={[
								{
									title: 'Initial Code',
									open: true,
									content: level.initialCode,
									onChange: content => {
										level.initialCode = content;
										const newLevel = plainToClass(LevelAliveModel, {
											...level,
										});
										setLevel(newLevel);
										saveLevelTimed();
									},
								},
								{
									title: 'Solution',
									open: false,
									content: level.solution,
									onChange: content => {
										level.solution = content;
										const newLevel = plainToClass(LevelAliveModel, {
											...level,
										});
										setLevel(newLevel);
										saveLevelTimed();
									},
								},
							]}
							handleChange={lineInterfaceContentChanges}
						/>
					) : (
						<LineInterface
							content={
								progression.data.code
									? progression.data.code
									: level.initialCode
							}
							handleChange={lineInterfaceContentChanges}
						/>
					)}
				</Col>
				<Col md={6} style={{ resize: 'both', padding: '0' }}>
					<Row id="simulation-row" style={{ height: '60%' }}>
						{executor && <Simulation init={s => executor.init(s)} />}
					</Row>
					<Row style={{ height: '40%' }}>
						<Cmd ref={cmdRef}></Cmd>
					</Row>
				</Col>
			</Row>
			<FormModal
				title={t('form.level.PATCH.title')}
				onSubmit={res => {
					const updatedLevel = plainToClass(LevelAliveModel, res.data);
					updatedLevel.creator = level.creator;
					setLevel(updatedLevel);
					setSettingsModalOpen(false);
				}}
				onClose={() => setSettingsModalOpen(false)}
				open={settingsModalOpen}
			>
				<Form
					action="PATCH"
					name="level"
					url={`levels/${level.id}`}
					inputGroups={[
						{
							name: 'name',
							inputType: 'text',
							required: true,
							default: level.name,
						},
						{
							name: 'description',
							inputType: 'text',
							default: level.description,
						},
						{
							name: 'access',
							required: true,
							inputType: 'select',
							selectOptions: LEVEL_ACCESS,
							default: level.access,
						},
						{
							name: 'difficulty',
							required: true,
							inputType: 'select',
							selectOptions: LEVEL_DIFFICULTY,
							default: level.difficulty,
						},
					]}
				/>
			</FormModal>
		</StyledAliveLevel>
	);
};

export default LevelAlive;