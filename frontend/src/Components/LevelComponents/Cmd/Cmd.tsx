import { CmdProps } from './cmdTypes';
import styled from 'styled-components';
import React from 'react';

const StyledDiv = styled.div`
	background-color: var(--primary-color);
	color: var(--foreground-color);
	padding: 15px;
	width: 100%;
	overflow-y: auto;
	font-family: Arial, Helvetica, sans-serif;
	font-size: large;

	pre {
		font-family: Arial, Helvetica, sans-serif;
<<<<<<< HEAD:frontend/src/Components/LevelComponents/Cmd/Cmd.tsx
		font-size: large;
		letter-spacing: 1px;
=======
		font-size: small;
>>>>>>> dev:frontend/src/Components/PlayComponents/Cmd/Cmd.tsx
		color: var(--foreground-color);
		line-height: 2rem;
	}

	a {
		cursor: pointer;
	}
`;

const Cmd = React.forwardRef<HTMLDivElement>((props: CmdProps, ref) => {
	return <StyledDiv ref={ref} />;
});

export default Cmd;