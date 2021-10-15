import controller from '../../assets/images/controller.png';

import './gamepad.css';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';
import CenteredContainer from '../UtilsComponents/CenteredContainer/CenteredContainer';

const StyledDiv = styled(Col)`
	background-color: var(--primary-color);

	width: 500px;
	height: 300px;

	img {
		border-radius: 20px;
		width: 500px;
		height: 300px;
	}
`;

const StyledCenteredContainer = styled(CenteredContainer)`
	padding: 0 0 0 22%;

	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;
const GamepadAlive = () => {
	document.body.onkeydown = e => {
		if (e.code == 'Space') {
			document.getElementById('btnStart')?.classList.add('push');
		}
		if (e.code == 'KeyS') {
			document.getElementById('btnB')?.classList.add('push');
		}
		if (e.code == 'KeyX') {
			document.getElementById('btnX')?.classList.add('push');
		}
		if (e.code == 'KeyZ') {
			document.getElementById('btnA')?.classList.add('push');
		}
		if (e.code == 'KeyC') {
			document.getElementById('btnY')?.classList.add('push');
		}
	};

	document.body.onkeyup = e => {
		if (e.code === 'Space') {
			document.getElementById('btnStart')?.classList.remove('push');
		}
		if (e.code === 'KeyS') {
			document.getElementById('btnB')?.classList.remove('push');
		}
		if (e.code == 'KeyX') {
			document.getElementById('btnX')?.classList.remove('push');
		}
		if (e.code == 'KeyZ') {
			document.getElementById('btnA')?.classList.remove('push');
		}
		if (e.code == 'KeyC') {
			document.getElementById('btnY')?.classList.remove('push');
		}
	};

	return (
		<>
			<StyledCenteredContainer className="container">
				<StyledDiv>
					<img src={controller} alt="" />

					<button className="button btnStart" id="btnStart">
						Start
					</button>

					<button className="button btnA" id="btnA">
						A
					</button>

					<button className="button btnB" id="btnB">
						B
					</button>

					<button className="button btnX" id="btnX">
						X
					</button>

					<button className="button btnY" id="btnY">
						Y
					</button>
				</StyledDiv>
			</StyledCenteredContainer>
		</>
	);
};

export default GamepadAlive;
