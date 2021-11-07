import {
	ButtonProps,
	ButtonVariants,
	StyledSecondaryButton,
	StyledDangerButton,
	StyledPrimaryButton,
} from './buttonTypes';
import { useHistory } from 'react-router';

/**
 * Styled button with different premade variants
 *
 * @param {string} variant primary secondary or danger variant
 * @param {React.ReactNode} children react children
 * @param {string} type button type: button, submit or reset
 * @param {() => void} onClick callback called when the button is clicked
 * @param {string} to url to redirect on click
 * @param {string} padding css padding
 * @param {string} className css classes applied to the button
 *
 * @author MoSk3
 */
const Button = ({
	variant,
	type,
	onClick,
	to,
	children,
	padding,
	className,
	disabled,
}: ButtonProps) => {
	const history = useHistory();

	const customOnClick = () => {
		onClick ? onClick() : to && history.push(to);
	};

	const renderSwitch = (param: ButtonVariants) => {
		const defaultInputOptions = {
			className: 'btn ' + className,
			padding,
			type,
			disabled,
			onClick: customOnClick,
		};

		switch (param) {
			case 'secondary':
				return (
					<StyledSecondaryButton {...defaultInputOptions}>
						{children}
					</StyledSecondaryButton>
				);
			case 'danger':
				return (
					<StyledDangerButton {...defaultInputOptions}>
						{children}
					</StyledDangerButton>
				);
			default:
				return (
					<StyledPrimaryButton {...defaultInputOptions}>
						{children}
					</StyledPrimaryButton>
				);
		}
	};

	return <>{renderSwitch(variant)}</>;
};

export default Button;