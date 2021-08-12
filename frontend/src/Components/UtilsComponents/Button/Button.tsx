import { ButtonProps, ButtonTypes } from './buttonTypes';
import styled from 'styled-components';

const PrimaryButton = styled.button`
	background-color: var(--third-color) !important;
	border-style: none;
	color: white;

	&:hover {
		background-color: var(--contrast-color) !important;
		color: white;
	}
`;

const DangerButton = styled.button`
	background-color: rgb(207, 0, 0) !important;
	border-style: none;
	color: white;

	&:hover {
		background-color: var(--contrast-color) !important;
		color: white;
	}
`;

const SecondaryButton = styled.button`
	background-color: var(--secondary-color) !important;
	border-style: none;

	&:hover {
		background-color: var(--contrast-color) !important;
	}
`;

const Button = ({ variant, type, onClick, children }: ButtonProps) => {
	const renderSwitch = (param: ButtonTypes) => {
		switch (param) {
			case 'secondary':
				return (
					<SecondaryButton className="btn" type={type} onClick={onClick}>
						{children}
					</SecondaryButton>
				);
			case 'danger':
				return (
					<DangerButton className="btn" type={type} onClick={onClick}>
						{children}
					</DangerButton>
				);
			default:
				return (
					<PrimaryButton className="btn" type={type} onClick={onClick}>
						{children}
					</PrimaryButton>
				);
		}
	};

	return <>{renderSwitch(variant)}</>;
};

export default Button;