import { IconButtonProps } from './iconButtonTypes';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useHistory } from 'react-router';

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
		const { onClick, to, ...other } = props;
		const history = useHistory();
		return (
			<StyledButton
				onClick={() => {
					onClick && onClick();
					to && history.push(to);
				}}
				className="icon-button"
				ref={ref}
			>
				<FontAwesomeIcon fixedWidth {...other} />
			</StyledButton>
		);
	},
);

export default IconButton;