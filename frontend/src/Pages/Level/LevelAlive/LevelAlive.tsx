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
import { useAlert } from 'react-alert';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import Confetti from 'react-confetti';

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
 * @author Ecoral360
 * @author MoSk3
 */
const LevelAlive = ({
	level: currentLevel,
	editMode,
	progression,
	initialCode,
	setLevel,
	setProgression,
}: LevelAliveProps) => {
	const { user, playSocket } = useContext(UserContext);

	const [cmdRef, cmd] = useCmd();
	const { executor, setExecutor, setExecutorLines, setSketch } =
		useExecutor<LevelAliveExecutor>(LevelAliveExecutor, cmd);

	const history = useHistory();
	const alert = useAlert();
	const { routes, goToNewTab } = useRoutes();
	const { t } = useTranslation();
	const [editTitle, setEditTitle] = useState(false);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [accountModalOpen, setAccountModalOpen] = useState(false);
	const saveTimeout = useRef<any>(null);
	const messageTimeout = useRef<any>(null);

	const [showConfetti, setShowConfetti] = useState(false);

	const level = useRef<LevelAliveModel>();
	useEffect(() => {
		level.current = currentLevel;
	}, [currentLevel]);

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
		if (user && editMode && level.current?.creator?.id !== user.id)
			return history.push(routes.public.home.path);

		setExecutor(
			new LevelAliveExecutor(level.current!.name, editMode, playSocket, user ?? undefined),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, level]);

	const saveLevel = useCallback(async () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);

		if (!level.current) {
			if (process.env.REACT_APP_DEBUG) console.log('save aborted');
			return;
		}

		const updatedLevel = (await api.db.levels.update(
			{
				id: level.current.id,
			},
			level.current,
		)) as LevelAliveModel;
		messageTimeout.current = setTimeout(() => {
			setSaving(false);
			setSaved(true);

			messageTimeout.current = setTimeout(() => {
				setSaved(false);
			}, 5000);
		}, 500);

		level.current = updatedLevel;
		if (process.env.REACT_APP_DEBUG) console.log(level.current.layout);
	}, [level]);

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
				id: level.current!.id,
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
	}, [progression, setProgression, user]);

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
			{level.current ? (
				<StyledAliveLevel editMode={editMode}>
					<Row className="h-100">
						<Col className="left-col" md={6}>
							<div className="tools-bar">
								{editMode && editTitle ? (
									<input
										type="text"
										autoFocus
										onBlur={() => setEditTitle(false)}
										defaultValue={level.current!.name}
									/>
								) : (
									<label
										className="level-title"
										onClick={() => editMode && setEditTitle(true)}
									>
										{level.current ? level.current.name : 'Sans nom'}
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
									user.id === level.current?.creator?.id && (
										<IconButton
											to={routes.auth.level_edit.path.replace(
												':id',
												level.current.id,
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
											defaultContent: level.current.initialCode,
											onChange: content => {
												level.current!.initialCode = content;
												saveLevelTimed();
											},
										},
										{
											title: 'Solution',
											open: false,
											defaultContent: level.current.solution,
											onChange: content => {
												level.current!.solution = content;
												saveLevelTimed();
											},
										},
									]}
									handleChange={lineInterfaceContentChanges}
								/>
							) : (
								<LineInterface
									initialContent={
										progression?.data.code
											? progression.data.code
											: level.current.initialCode
									}
									handleChange={lineInterfaceContentChanges}
								/>
							)}
						</Col>
						<Col md={6} style={{ resize: 'both', padding: '0' }}>
							<Row id="simulation-row" style={{ height: '60vh' }}>
								{executor && level.current.layout && (
									<Simulation
										id={level.current.id}
										init={s => {
											executor.init(s);
											setSketch(s);
											executor.loadLevelLayout(level.current?.layout ?? '[]');
											executor.stop();
										}}
										onChange={(s: any) => {
											const newLayout = executor.saveLayout(s);
											if (!newLayout) {
												alert.error(
													'Une erreur est survenue lors de la sauvegarde du niveau',
												);
												return;
											}
											level.current!.layout = newLayout;
											saveLevelTimed();
										}}
										stopExecution={() => executor.stop()}
										setShowConfetti={set => setShowConfetti(set)}
									/>
								)}
							</Row>
							<Row style={{ height: '40vh' }}>
								<Cmd ref={cmdRef}></Cmd>
							</Row>
						</Col>
					</Row>
					<FormModal
						title={t('form.level.PATCH.title')}
						onSubmit={res => {
							if (!level.current) return;
							const updatedLevel = plainToClass(LevelAliveModel, res.data);
							updatedLevel.creator = level.current.creator;
							level.current = updatedLevel;
							setSettingsModalOpen(false);
						}}
						onClose={() => setSettingsModalOpen(false)}
						open={settingsModalOpen}
					>
						<Form
							action="PATCH"
							name="level"
							url={`levels/${level.current!.id}`}
							inputGroups={[
								{
									name: 'name',
									inputType: 'text',
									required: true,
									default: level.current?.name,
									minLength: 3,
									maxLength: 25,
								},
								{
									name: 'description',
									inputType: 'text',
									default: level.current?.description,
									maxLength: 200,
								},
								{
									name: 'access',
									required: true,
									inputType: 'select',
									selectOptions: LEVEL_ACCESS,
									default: level.current?.access,
								},
								{
									name: 'difficulty',
									required: true,
									inputType: 'select',
									selectOptions: LEVEL_DIFFICULTY,
									default: level.current?.difficulty,
								},
							]}
						/>
					</FormModal>
				</StyledAliveLevel>
			) : (
				<LoadingScreen />
			)}
			{showConfetti && <Confetti />}
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
