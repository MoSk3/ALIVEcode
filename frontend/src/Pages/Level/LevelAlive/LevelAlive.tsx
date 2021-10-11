import { LevelAliveProps, StyledAliveLevel } from './levelAliveTypes';
import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Simulation from '../../../Components/LevelComponents/Simulation/Simulation';
import { Row, Col } from 'react-bootstrap';
import {
	faBookOpen,
	faCog,
	faPauseCircle,
	faPencilAlt,
	faPlayCircle,
	faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../../Components/DashboardComponents/IconButton/IconButton';
import Cmd from '../../../Components/LevelComponents/Cmd/Cmd';
import LevelAliveExecutor from './LevelAliveExecutor';
import useCmd from '../../../state/hooks/useCmd';
import { useHistory } from 'react-router-dom';
import useRoutes from '../../../state/hooks/useRoutes';
import FormModal from '../../../Components/UtilsComponents/FormModal/FormModal';
import Form from '../../../Components/UtilsComponents/Form/Form';
import Button from '../../../Components/UtilsComponents/Button/Button';
import { plainToClass } from 'class-transformer';
import { LevelAlive as LevelAliveModel } from '../../../Models/Level/levelAlive.entity';
import api from '../../../Models/api';
import {
	LEVEL_ACCESS,
	LEVEL_DIFFICULTY,
} from '../../../Models/Level/level.entity';
import $ from 'jquery';
import { useTranslation } from 'react-i18next';
import Modal from '../../../Components/UtilsComponents/Modal/Modal';
import useExecutor from '../../../state/hooks/useExecutor';

/**
 * Alive level page. Contains all the components to display and make the alive level functionnal.
 *
 * @param {LevelAliveModel} level alive level object
 * @param {boolean} editMode if the level is in editMode or not
 * @param {LevelProgression} progression the level progression of the current user
 * @param {string} initialCode the initial code of the level
 * @param {(level: LevelAliveModel) => void} setLevel callback used to modify the level in the parent state
 * @param {(progression: LevelProgression) => void} setProgression callback used to modify the level progression in the parent state
 *
 * @author MoSk3
 */
const LevelAlive = ({
	level,
	editMode,
	progression,
	initialCode,
	setLevel,
	setProgression,
}: LevelAliveProps) => {
	const { user } = useContext(UserContext);

	const [cmdRef, cmd] = useCmd();
	const { executor, setExecutor, setExecutorLines, setSketch } =
		useExecutor<LevelAliveExecutor>(LevelAliveExecutor, cmd);

	const history = useHistory();
	const { routes, goToNewTab } = useRoutes();
	const { t } = useTranslation();
	const [editTitle, setEditTitle] = useState(false);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [accountModalOpen, setAccountModalOpen] = useState(false);
	const saveTimeout = useRef<any>(null);
	const messageTimeout = useRef<any>(null);

	const lineInterfaceContentChanges = (content: any) => {
		setExecutorLines(content);
		if (!editMode && progression) {
			progression.data.code = content;
			const updatedProgression = progression;
			setProgression(updatedProgression);
			saveProgressionTimed();
		}
	};

	useEffect(() => {
		if (user && editMode && level.creator && level.creator.id !== user.id)
			return history.push(routes.public.home.path);

		setExecutor(new LevelAliveExecutor(level.name, user ?? undefined));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, level]);

	const saveLevel = useCallback(async () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);
		const updatedLevel = (await api.db.levels.update(
			{
				id: level.id,
			},
			level,
		)) as LevelAliveModel;
		messageTimeout.current = setTimeout(() => {
			setSaving(false);
			setSaved(true);

			messageTimeout.current = setTimeout(() => {
				setSaved(false);
			}, 5000);
		}, 500);
		setLevel(updatedLevel);
	}, [level, setLevel]);

	const saveLevelTimed = () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveLevel, 2000);
	};

	const saveProgression = useCallback(async () => {
		if (!user || !progression) return;
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);
		const updatedProgression = await api.db.levels.progressions.save(
			{
				id: level.id,
				userId: user.id,
			},
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
	}, [level.id, progression, setProgression, user]);

	const saveProgressionTimed = () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveProgression, 2000);
	};

	useEffect(() => {
		$(document).off('keydown');
		$(document).on('keydown', e => {
			if (e.key === 's' && e.ctrlKey) {
				e.preventDefault();
				e.stopPropagation();
				if (!user) return setAccountModalOpen(true);
				editMode ? saveLevel() : saveProgression();
			}
		});
	}, [editMode, saveLevel, saveProgression, user]);

	useEffect(() => {
		return () => {
			clearTimeout(saveTimeout.current);
			clearTimeout(messageTimeout.current);
			$(document).off('keydown');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
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
							{user &&
								!editMode &&
								level.creator &&
								user.id === level.creator.id && (
									<IconButton
										to={routes.auth.level_edit.path.replace(
											':levelId',
											level.id,
										)}
										icon={faPencilAlt}
										size="2x"
									/>
								)}
							<IconButton
								onClick={() => goToNewTab(routes.public.asDocs.path)}
								icon={faBookOpen}
								size="2x"
							/>
							<IconButton icon={faQuestionCircle} size="2x" />
							{/* Do not change the onClick method!! it MUST be a method that calls the toggleExecution */}
							<IconButton
								onClick={() => executor?.toggleExecution()}
								icon={executor?.execution ? faPauseCircle : faPlayCircle}
								size="2x"
							/>
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
										defaultContent: level.initialCode,
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
										defaultContent: level.solution,
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
								initialContent={initialCode}
								handleChange={lineInterfaceContentChanges}
							/>
						)}
					</Col>
					<Col md={6} style={{ resize: 'both', padding: '0' }}>
						<Row id="simulation-row" style={{ height: '60%' }}>
							{executor && (
								<Simulation
									init={s => {
										executor.init(s);
										setSketch(s);
									}}
								/>
							)}
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
								minLength: 3,
								maxLength: 25,
							},
							{
								name: 'description',
								inputType: 'text',
								default: level.description,
								maxLength: 200,
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
			<Modal
				title={t('msg.auth.account_required')}
				open={accountModalOpen}
				onClose={() => setAccountModalOpen(false)}
			>
				<Button
					variant="primary"
					to={routes.non_auth.signup.path}
					className="mb-2"
				>
					{t('msg.auth.signup')}
				</Button>
				<br />
				or
				<br />
				<Button
					variant="primary"
					to={routes.non_auth.signin.path}
					className="mt-2"
				>
					{t('msg.auth.signin')}
				</Button>
			</Modal>
		</>
	);
};

export default LevelAlive;


	/*
	useEffect(() => {
		if (!process.env.REACT_APP_IOT_URL) return;

		const socket = new WebSocket('ws://localhost:8888');
		socket.onopen = () => {
			console.log('YEP');
			socket.send(
				JSON.stringify({
					event: 'connect_watcher',
					data: {
						targets: [{ id: '1' }],
					},
				}),
			);
			setTimeout(() => {
				socket.send(
					JSON.stringify({
						event: 'execute',
						data: {
							executionResult: [
								{
									p: [],
									d: 0,
									id: 0,
								},
								{
									p: [1],
									d: 1,
									id: 101,
								},
								{
									p: [1],
									d: 1,
									id: 102,
								},
								{
									p: [-10],
									d: 0,
									id: 103,
								},
								{
									p: [45],
									d: 0,
									id: 103,
								},
							],
						},
					}),
				);
			}, 5000);
		};

		socket.onmessage = e => {
			console.log(e);
		};

		const carSocket = io(`${process.env.REACT_APP_IOT_URL}`);

		carSocket.emit('connect_car', '1234');
		carSocket.on('execute', d => {
			console.log(d);
		});
		const socket = io(`${process.env.REACT_APP_IOT_URL}`);

		socket.emit('connect_watcher', {
			targets: [{ id: '123' }, { id: '1234' }],
		});
		socket.emit('execute', {
			executionResult: [
				{
					p: [1],
					d: 1,
					id: 101,
				},
				{
					p: [1],
					d: 1,
					id: 102,
				},
				{
					p: [-3800],
					d: 0,
					id: 103,
				},
				{
					p: [45],
					d: 0,
					id: 103,
				},
				{
					p: ['[exécution terminée]'],
					d: 0,
					id: 300,
				},
				{
					p: [],
					d: 0,
					id: 0,
				},
			],
		});

		return () => {
			socket?.close();
			//carSocket?.close();
		};
	}, []);
	*/
