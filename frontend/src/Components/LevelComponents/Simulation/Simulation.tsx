import FillContainer from "../../UtilsComponents/FillContainer/FillContainer";
import { sketch } from './Sketch/simulation/sketch';
import P5Wrapper from 'react-p5-wrapper';
import { SimulationProps, StyledSimulation } from './simulationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';

const Simulation = ({ init, onChange }: SimulationProps) => {
	return (
		<StyledSimulation>
			<FillContainer
				className="simulation-div"
				relative
				style={{ backgroundColor: 'white' }}
			>
				<FontAwesomeIcon
					className="zoom-button"
					icon={faSquare}
					color="black"
				/>
				{$('simulation-div') ? (
					<P5Wrapper
						fullscreenDiv="fullscreen-div"
						canvasDiv="simulation-div"
						zoomButton={''}
						init={init}
						sketch={sketch}
						onChange={onChange}
					/>
				) : (
					<LoadingScreen />
				)}
			</FillContainer>
			<FillContainer className="fullscreen-div" startAtTop />
		</StyledSimulation>
	);
};

export default Simulation;