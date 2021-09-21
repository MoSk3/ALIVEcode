import styled from 'styled-components';

export type SimulationProps = {
	init: (s: any) => void;
	handleChange: (content: any) => void;
};

export const StyledSimulation = styled.div`
	.zoom-button {
		position: absolute;
		right: 0;
		top: 0;
	}

	.fullscreen-div {
		position: fixed;
		z-index: 100;
		left: 0;
		display: none;
	}
`;