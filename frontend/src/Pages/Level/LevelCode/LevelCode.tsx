import {
	faBookOpen,
	faQuestionCircle,
	faPlayCircle,
	faPauseCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import IconButton from '../../../Components/DashboardComponents/IconButton/IconButton';
import Cmd from '../../../Components/LevelComponents/Cmd/Cmd';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import useCmd from '../../../state/hooks/useCmd';
import LevelCodeExecutor from './LevelCodeExecutor';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import { LevelCodeProps } from './levelCodeTypes';

const StyledDiv = styled(FillContainer)`
	overflow-y: hidden;

	.row {
		padding: 0;
		margin: 0;
	}
`;

const LevelCode = ({ level }: LevelCodeProps) => {
	//const alert = useAlert();
	//const history = useHistory();

	//const [level, setLevel] = useState<any>();
	const [executor, setExecutor] = useState<LevelCodeExecutor>();

	const playButton = useRef<HTMLButtonElement>(null);

	const [cmdRef, cmd] = useCmd();

	const lineInterfaceContentChanges = (content: any) => {
		if (executor) executor.lineInterfaceContent = content;
	};

	useEffect(() => {
		if (cmd && executor) executor.cmd = cmd;
	}, [cmd, executor]);

	useEffect(() => {
		if (!playButton.current) return;
		setExecutor(
			new LevelCodeExecutor(undefined, 'no name', playButton.current),
		);
	}, []);

	const [buttonIcon, setButtonIcon] = useState(faPlayCircle);

	return (
		<StyledDiv>
			<Row style={{ height: '100%' }}>
				<Col
					md={6}
					style={{
						resize: 'both',
						padding: '0',
						display: 'flex',
						flexFlow: 'column',
					}}
				>
					<div
						style={{
							flex: '0 1 70px',
							backgroundColor: '#013677',
							border: 'none',
						}}
					>
						<IconButton icon={faBookOpen} size="2x" />
						<IconButton icon={faQuestionCircle} size="2x" />
						<IconButton
							icon={buttonIcon}
							size="2x"
							ref={playButton}
							onClick={() =>
								setButtonIcon(
									buttonIcon === faPlayCircle ? faPauseCircle : faPlayCircle,
								)
							}
						/>
					</div>
					<LineInterface handleChange={lineInterfaceContentChanges} />
				</Col>

				<Col md={6} style={{ resize: 'both', padding: '0' }}>
					<Row style={{ height: '0%' }}></Row>
					<Row style={{ height: '100%' }}>
						<Cmd ref={cmdRef}></Cmd>
					</Row>
				</Col>
			</Row>
		</StyledDiv>
	);
};

export default LevelCode;
