import { ButtonProps, ButtonVariants, StyledButtonProps } from './buttonTypes';
import styled from 'styled-components';
import { useHistory } from 'react-router';

const PrimaryButton = styled.button`
	background-color: var(--third-color) !important;
	border-style: none;
	color: white;
	padding: ${({ padding }: StyledButtonProps) => padding ?? 'none'};

	&:hover {
		background-color: var(--contrast-color) !important;
		color: white;
	}
`;

const DangerButton = styled.button`
	background-color: rgb(207, 0, 0) !important;
	border-style: none;
	color: white;
	padding: ${({ padding }: StyledButtonProps) => padding ?? 'none'};

	&:hover {
		background-color: var(--contrast-color) !important;
		color: white;
	}
`;

const SecondaryButton = styled.button`
	background-color: var(--secondary-color) !important;
	border-style: none;
	color: white;
	padding: ${({ padding }: StyledButtonProps) => padding ?? 'none'};

	&:hover {
		background-color: var(--contrast-color) !important;
		color: white;
	}
`;

const Button = ({
	variant,
	type,
	onClick,
	to,
	children,
	padding,
	className,
}: ButtonProps) => {
	const history = useHistory();

	const customOnClick = () => {
		onClick ? onClick() : to && history.push(to);
	};

	const renderSwitch = (param: ButtonVariants) => {
		switch (param) {
			case 'secondary':
				return (
					<SecondaryButton
						className={'btn ' + className}
						padding={padding}
						type={type}
						onClick={customOnClick}
					>
						{children}
					</SecondaryButton>
				);
			case 'danger':
				return (
					<DangerButton
						className={'btn ' + className}
						padding={padding}
						type={type}
						onClick={customOnClick}
					>
						{children}
					</DangerButton>
				);
			default:
				return (
					<PrimaryButton
						className={'btn ' + className}
						padding={padding}
						type={type}
						onClick={customOnClick}
					>
						{children}
					</PrimaryButton>
				);
		}
	};

	return <>{renderSwitch(variant)}</>;
};

export default Button;