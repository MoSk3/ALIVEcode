import FillContainer from "../../UtilsComponents/FillContainer/FillContainer";
import { sketch } from './Sketch/simulation/sketch';
import P5Wrapper from 'react-p5-wrapper';
import { SimulationProps, StyledSimulation } from './simulationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { useState } from 'react';

/**
 * Simulation component that draws the car and make it functionnal
 *
 * @param {(s: any) => void} init init function that has the generated sketch as an argument
 *
 * @author Ecoral360
 * @author MoSk3
 */
const Simulation = ({ init, onChange, id }: SimulationProps) => {
	const [loading, setLoading] = useState(true);

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
						/>
					</>
				) : (
					<LoadingScreen relative />
				)}
			</FillContainer>
			<FillContainer className="fullscreen-div" startAtTop />
		</StyledSimulation>
	);
};

export default Simulation;