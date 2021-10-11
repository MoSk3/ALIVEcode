import FillContainer from "../../UtilsComponents/FillContainer/FillContainer";
import { Button, Modal as BootModal } from 'react-bootstrap';
import { sketch } from './Sketch/simulation/sketch';
import P5Wrapper from 'react-p5-wrapper';
import { SimulationProps, StyledSimulation } from './simulationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { useState, useRef, useCallback } from 'react';
import Modal from '../../UtilsComponents/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-bootstrap';

/**
 * Simulation component that draws the car and make it functionnal
 *
 * @param {(s: any) => void} init init function that has the generated sketch as an argument
 *
 * @author Ecoral360
 * @author MoSk3
 */
const Simulation = ({
	init,
	onChange,
	id,
	stopExecution,
	setShowConfetti,
}: SimulationProps) => {
	const [loading, setLoading] = useState(true);
	const [loseModalOpen, setLoseModalOpen] = useState(false);
	const [loseDescripton, setLoseDescription] = useState('');
	const [winModalOpen, setWinModalOpen] = useState(false);
	const [deathGif, setDeathGif] = useState<string>();
	const { t } = useTranslation();

	const onLose = useCallback(
		(death_gif: string, msg: string) => {
			setDeathGif(death_gif);
			setLoseDescription(msg);
			setLoseModalOpen(true);
			stopExecution();
		},
		[stopExecution],
	);

	const onWin = useCallback(() => {
		setWinModalOpen(true);
		setShowConfetti(true);
		stopExecution();
	}, [stopExecution, setShowConfetti]);

	return (
		<StyledSimulation>
			<FillContainer id={id} relative style={{ backgroundColor: 'white' }}>
				<FontAwesomeIcon
					className="zoom-button"
					icon={faSquare}
					color="black"
				/>
				{$(`#${id}`) ? (
					<>
						{loading && <LoadingScreen relative />}
						<P5Wrapper
							fullscreenDiv="fullscreen-div"
							canvasDiv={id}
							zoomButton={''}
							init={(s: any) => {
								setLoading(false);
								init(s);
							}}
							sketch={sketch}
							onChange={onChange}
							onWin={onWin}
							onLose={onLose}
						/>
					</>
				) : (
					<LoadingScreen relative />
				)}
			</FillContainer>
			<FillContainer className="fullscreen-div" startAtTop />
			<Modal
				title={t('simulation.lose')}
				open={loseModalOpen}
				onClose={() => setLoseModalOpen(false)}
				hideCloseButton
				centered
				submitText={t('simulation.retry')}
			>
				<Image alt="lose gif" src={deathGif}></Image>
				<br />
				{loseDescripton}
			</Modal>
			<Modal
				title={t('simulation.win')}
				open={winModalOpen}
				onClose={() => {
					setWinModalOpen(false);
					setShowConfetti(false);
				}}
				hideCloseButton
				centered
				submitText={t('simulation.continue')}
			>
				🎉🎉🎉
			</Modal>
		</StyledSimulation>
	);
};

export default Simulation;