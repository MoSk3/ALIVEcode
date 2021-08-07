import { IconButtonProps } from './iconButtonTypes';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const StyledButton = styled.button`
	background-color: var(--third-color);
	border: none;
	border-radius: 10px;
	color: white;
	padding: 5px 5px;
	transition: 0.2s;

	&:hover {
		background-color: var(--contrast-color);
	}
`;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(props, ref) => {
		return (
			<StyledButton ref={ref}>
				<FontAwesomeIcon fixedWidth {...props} />
			</StyledButton>
		);
	},
);

export default IconButton;