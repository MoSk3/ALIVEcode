import FillContainer from "../../MiscComponents/FillContainer/FillContainer";
import { sketch } from "./Sketch/simulation/sketch";
import P5Wrapper from 'react-p5-wrapper';
import { SimulationProps } from './simulationTypes';

const Simulation = ({ init }: SimulationProps) => {

	return (
		<>
			<FillContainer id="simulation-div" relative style={{ backgroundColor: 'white' }}>
				<P5Wrapper fullscreenDiv="fullscreenDiv" zoomButton={""} init={init} sketch={sketch} />
			</FillContainer>
			<FillContainer id="fullscreenDiv" startAtTop style={{position: 'fixed', zIndex: 100, left: 0, display: 'none'}}/>
		</>
	)
}

export default Simulation;