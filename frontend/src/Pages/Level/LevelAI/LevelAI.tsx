import { LevelAIProps, StyledAliveLevel } from './levelAITypes';
import { useEffect, useState, useContext, useRef, useCallback } from 'react';
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
import dataAI from './dataAI.json';
import Modal from '../../../Components/UtilsComponents/Modal/Modal';
import useExecutor from '../../../state/hooks/useExecutor';
import LevelTable from '../../../Components/LevelComponents/LevelTable/LevelTable';
import LevelGraph from '../../../Components/LevelComponents/LevelGraph/LevelGraph';
import PolyOptimizer from './artificial_intelligence/PolyOptmizer';
import RegressionOptimizer from './artificial_intelligence/RegressionOptimizer';
import DataTypes from '../../../Components/LevelComponents/LevelGraph/DataTypes';
import PolyRegression from '../../../Components/LevelComponents/LevelGraph/PolyRegression';

/**
 * Ai level page. Contains all the components to display and make the ai level functionnal.
 *
 * @param {LevelAIModel} level ai level object
 * @param {boolean} editMode if the level is in editMode or not
 * @param {LevelProgression} progression the level progression of the current user
 * @param {string} initialCode the initial code of the level
 * @param {(level: LevelAIModel) => void} setLevel callback used to modify the level in the parent state
 * @param {(progression: LevelProgression) => void} setProgression callback used to modify the level progression in the parent state
 *
 * @author Félix
 * @author Enric
 * @author Mathis
 */
const LevelAI = ({
	level,
	editMode,
	progression,
	initialCode,
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
	let func = useRef<PolyRegression>();
	const mainDataset: DataTypes = {
		type: 'scatter',
		label: "Distance parcourue en fonction de l'énergie",
		data,
		backgroundColor: 'var(--contrast-color)',
		borderWidth: 1,
	};
	const initialDataset: DataTypes = Object.freeze({
		type: 'scatter',
		label: "Distance parcourue en fonction de l'énergie",
		data: [{}],
		backgroundColor: 'var(--contrast-color)',
		borderWidth: 1,
	});
	let datasets = useRef([initialDataset]);
	let pointsOnGraph: boolean = false;
	let regOnGraph: boolean = false;

	const [chartData, setChartData] = useState({ datasets: datasets.current });

	/**
	 * Resets the datasets array and the data shown on the graph.
	 */
	function resetGraph() {
		datasets.current = [initialDataset];
		setChartData({ datasets: datasets.current });
	}

	/**
	 * Adds a new dataset to the datasets array.
	 * @param newData the new dataset to add.
	 */
	function setDataOnGraph(newData: DataTypes): void {
		datasets.current.push(newData);
		setChartData({ datasets: datasets.current });
	}
	//-------------------------- Alivescript functions ----------------------------//

	/**
	 * Sets the data of the graph to the level's data and displays it on the screen
	 */
	function showDataCloud(): void {
		pointsOnGraph = true;
		setDataOnGraph(mainDataset);
	}

	/**
	 * Replaces the func with a new one with the specified parameters.
	 * @param a the param a of a polynomial regression.
	 * @param b the param b of a polynomial regression.
	 * @param c the param c of a polynomial regression.
	 * @param d the param d of a polynomial regression.
	 */
	function createRegression(a: number, b: number, c: number, d: number) {
		func.current = new PolyRegression(a, b, c, d);
	}

	/**
	 * Generates the regression's points and shows them on the graph.
	 */
	function showRegression() {
		const points = func.current!.generatePoints();
		setDataOnGraph(points);
	}

	/**
	 * Creates the new Regression and displays it on the graph.
	 * @param a the param a of a polynomial regression.
	 * @param b the param b of a polynomial regression.
	 * @param c the param c of a polynomial regression.
	 * @param d the param d of a polynomial regression.
	 */
	function createAndShowReg(a: number, b: number, c: number, d: number): void {
		createRegression(a, b, c, d);
		showRegression();
	}

	/**
	 * Calculates the MSE cost for the current regression compared to the dataset of the level.
	 * @returns the calculated cost.
	 */
	function costMSE(): string {
		if (pointsOnGraph) setDataOnGraph(mainDataset);
		showRegression();
		return 'Erreur du modèle : ' + func.current!.computeMSE(data);
	}

	/**
	 * Creates a new Regression that fits as close as possible the data and shows it on
	 * the graph.
	 * @param lr the learning rate for the optimization algorithm.
	 */
	function optimizeRegression(lr: number, epoch: number): void {
		if (!func.current) return;
		const optimizer: PolyOptimizer = new PolyOptimizer(
			func.current,
			lr,
			epoch,
			RegressionOptimizer.costMSE,
		);
		func.current = optimizer.optimize(data);
		showRegression();
		cmd?.print('Nouveaux paramètres de la régression :');
		cmd?.print(func.current.paramsToString());
	}

	/**
	 * Evaluates the model with the value specified and returns the result.
	 * @param x the input of the model.
	 * @returns the output of the model.
	 */
	function evaluate(x: number): number {
		if (pointsOnGraph) setDataOnGraph(mainDataset);
		showRegression();
		return func.current!.compute(x);
	}

	useEffect(() => {
		if (user && editMode && level.creator && level.creator.id !== user.id)
			return history.push(routes.public.home.path);

		setExecutor(
			new LevelAIExecutor(
				{
					createAndShowReg,
					showDataCloud,
					resetGraph,
					optimizeRegression,
					evaluate: (x: number) => evaluate(x),
					costMSE: () => costMSE(),
					showRegression,
				},
				level.name,
				user || undefined,
			),
		);
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
		)) as LevelAIModel;
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
	}, [level, progression, setProgression, user]);

	const saveProgressionTimed = () => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveProgression, 2000);
	};

	useEffect(() => {
		$(document).off('keydown');
		$(document).on('keydown', e => {
			//If ctrl + s are pressed together
			if (e.keyCode === 83 && e.ctrlKey) {
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
								initialContent={initialCode}
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
									data={data}
									xData="Énergie utilisée (kWh)"
									yData="Distance parcourue (km)"
								/>
							</Col>
							<Col md={8} style={{ padding: '0' }}>
								<div className="graph-container">
									<LevelGraph
										data={chartData}
										title="Distance parcourue selon l'énergie utilisée"
										xAxis="Énergie utilisée (kWh)"
										yAxis="Distance parcourue (km)"
									/>
								</div>
							</Col>
						</Row>
						<Row className="command">
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
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'text',
								default: level.description,
								maxLength: 500,
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