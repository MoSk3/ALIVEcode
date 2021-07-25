import FillContainer from "../../MiscComponents/FillContainer/FillContainer";
import P5Wrapper from "react-p5-wrapper";
import { sketch } from './Sketch/simulation/sketch';
import { sketchTest } from './Sketch/simulation/testSketch';

const Simulation = () => {

	return (
		<FillContainer relative style={{ backgroundColor: 'white' }}>
			<P5Wrapper sketch={sketch} />
		</FillContainer>
	)
}

export default Simulation;