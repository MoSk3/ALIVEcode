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
import {
	LEVEL_ACCESS,
	LEVEL_DIFFICULTY,
} from '../../../Models/Level/level.entity';

const LevelAlive = ({ level, editMode, setLevel }: LevelAliveProps) => {
	const { user } = useContext(UserContext);
	const [executor, setExecutor] = useState<LevelAliveExecutor>();
	const [cmdRef, cmd] = useCmd();
	const playButton = useRef<HTMLButtonElement>(null);
	const history = useHistory();
	const { routes } = useRoutes();
	const [editTitle, setEditTitle] = useState(false);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);

	const lineInterfaceContentChanges = (content: any) => {
		if (executor) executor.lineInterfaceContent = content;
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
								{/*
								<label className="save-message">Niveau sauvegardé ✔</label>
								*/}
								<IconButton
									onClick={() => setSettingsModalOpen(true)}
									icon={faCog}
									size="2x"
								/>
							</>
						)}
						{!editMode && user.id === level.creator.id && (
							<IconButton
								onClick={() => console.log('a')}
								to={routes.auth.level_edit.path.replace(':id', level.id)}
								icon={faPencilAlt}
								size="2x"
							/>
						)}
						<IconButton icon={faBookOpen} size="2x" />
						<IconButton icon={faQuestionCircle} size="2x" />
						<IconButton icon={faPlayCircle} size="2x" ref={playButton} />
					</div>

					<LineInterface handleChange={lineInterfaceContentChanges} />
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
				title="New route"
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
					action="UPDATE"
					buttonText="Update"
					name="update_level"
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