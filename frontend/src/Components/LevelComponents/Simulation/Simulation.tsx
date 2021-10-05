import FillContainer from "../../UtilsComponents/FillContainer/FillContainer";
import { sketch } from './Sketch/simulation/sketch';
import P5Wrapper from 'react-p5-wrapper';
import { SimulationProps, StyledSimulation } from './simulationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

/**
 * Simulation component that draws the car and make it functionnal
 *
 * @param {(s: any) => void} init init function that has the generated sketch as an argument
 *
 * @author MoSk3
 */
const Simulation = ({ init }: SimulationProps) => {
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
				<P5Wrapper
					fullscreenDiv="fullscreen-div"
					canvasDiv="simulation-div"
					zoomButton={''}
					init={init}
					sketch={sketch}
				/>
			</FillContainer>
			<FillContainer className="fullscreen-div" startAtTop />
		</StyledSimulation>
	);
};

export default Simulation;