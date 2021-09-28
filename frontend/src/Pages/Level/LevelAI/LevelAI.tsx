import { LevelAIProps, StyledAliveLevel } from './levelAITypes';
import { useEffect, useState, useContext, useRef, useMemo } from 'react';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
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
import LevelAIExecutor from './LevelAIExecutor';
import useCmd from '../../../state/hooks/useCmd';
import { useHistory } from 'react-router-dom';
import useRoutes from '../../../state/hooks/useRoutes';
import FormModal from '../../../Components/UtilsComponents/FormModal/FormModal';
import Form from '../../../Components/UtilsComponents/Form/Form';
import Button from '../../../Components/UtilsComponents/Button/Button';
import { plainToClass } from 'class-transformer';
import { LevelAI as LevelAIModel } from '../../../Models/Level/levelAI.entity';
import api from '../../../Models/api';
import {
	LEVEL_ACCESS,
	LEVEL_DIFFICULTY,
} from '../../../Models/Level/level.entity';
import $ from 'jquery';
import { useTranslation } from 'react-i18next';
import dataAI from "./dataAI.json"
import Modal from '../../../Components/UtilsComponents/Modal/Modal';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import useExecutor from '../../../state/hooks/useExecutor';
import LevelTable from '../../../Components/LevelComponents/LevelTable/LevelTable';
import LevelGraph from '../../../Components/LevelComponents/LevelGraph/LevelGraph';

const LevelAI = ({
	level,
	editMode,
	progression,
	setLevel,
	setProgression,
}: LevelAIProps) => {
	const { user } = useContext(UserContext);
	const [cmdRef, cmd] = useCmd();
	const { executor, setExecutor, setExecutorLines } =
		useExecutor<LevelAIExecutor>(LevelAIExecutor, cmd);
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

	//Set the data for the level
	const [data] = useState(dataAI);

	const [chartData, setChartData] = useState({
		datasets: [
			{
				label: "Distance parcourue en fonction de l'énergie",
				data: [{}],
				backgroundColor: 'var(--contrast-color)',
				borderWidth: 1,
			},
		],
	});

	const memorizedData = useMemo(() => data, [data]);
	const memorizedChartData = useMemo(() => chartData, [chartData]);

	function showDataCloud(): void {
		setChartData({
			datasets: [
				{
					label: "Distance parcourue en fonction de l'énergie",
					data: data,
					backgroundColor: 'var(--contrast-color)',
					borderWidth: 1,
				},
			]
		})
	}

	useEffect(() => {
		if (user && editMode && level.creator && level.creator.id !== user.id)
			return history.push(routes.public.home.path);

		setExecutor(new LevelAIExecutor([1, 2, 3, showDataCloud], level.name, user || undefined));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, level]);

	const saveLevel = async () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);
		const updatedLevel = (await api.db.levels.update(
			{
				id: level.id,
			},
			level,
		)) as LevelAIModel;
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
	};

	const saveProgressionTimed = () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveProgression, 2000);
	};

	useEffect(() => {
		$(document).on('keydown', e => {
			//If ctrl + s are pressed together
			if (e.keyCode === 83 && e.ctrlKey) {
				e.preventDefault();
				e.stopPropagation();
				if (!user) return setAccountModalOpen(true);
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

	return (
		<>
			<StyledAliveLevel editMode={editMode}>
				<Row className="h-100">
					{/* Left Side of screen */}
					<Col className="left-col" md={6}>
						{/* Barre d'infos du niveau */}
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
										to={routes.auth.level_edit.path.replace(':id', level.id)}
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

						{/* Interface de code */}
						{editMode ? (
							/* Interface du code avec les tabs */
							<LineInterface
								hasTabs
								tabs={[
									{
										title: 'Initial Code',
										open: true,
										defaultContent: level.initialCode,
										onChange: content => {
											level.initialCode = content;
											const newLevel = plainToClass(LevelAIModel, {
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
											const newLevel = plainToClass(LevelAIModel, {
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
							/* Interface de code sans les tabs */
							<LineInterface
								defaultContent={
									progression?.data.code
										? progression.data.code
										: level.initialCode
								}
								handleChange={lineInterfaceContentChanges}
							/>
						)}
					</Col>

					{/* Right Side of screen 
							Contains the graph and the console
					*/}
					<Col md={6} style={{ resize: 'both', padding: '0' }}>
						<Row className="data-section">
							<Col md={3}>
								<LevelTable
									data={memorizedData}
									xData="Énergie utilisée (kWh)"
									yData="Distance parcourue (km)"
								/>
							</Col>
							<Col md={9} style={{ padding: '0' }}>
								<div className="graph-container">
									<LevelGraph
										data={memorizedChartData}
										title="Distance parcourue selon l'énergie utilisée"
										xAxis="Énergie utilisée (kWh)"
										yAxis="Distance parcourue (km)"
									/>
								</div>
							</Col>
						</Row>
						<Row style={{ height: '40%' }}>
							<Cmd ref={cmdRef}></Cmd>
						</Row>
					</Col>
				</Row>

				{/*
					Update level form
				*/}
				<FormModal
					title={t('form.level.PATCH.title')}
					onSubmit={res => {
						const updatedLevel = plainToClass(LevelAIModel, res.data);
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

			{/*
				No account modal
			*/}
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

export default LevelAI;