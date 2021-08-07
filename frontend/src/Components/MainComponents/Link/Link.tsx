import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { LinkProps, StyledLinkProps } from './linkTypes';

const Link = ({
	to,
	className,
	children,
	style,
	dark,
	bold,
	block,
	onClick,
}: LinkProps) => {
	const history = useHistory();

	return (
		<label
			className={className}
			style={style}
			onClick={() => {
				if (onClick) onClick();
				else if (to) history.push(to);
			}}
		>
			{children}
		</label>
	);
};

export default styled(Link)`
	color: ${(props: StyledLinkProps) => {
		if (props.dark) return 'var(--contrast-color)';
		console.log(props.pale);
		if (props.pale) return 'var(--pale-color)';
		else return 'var(--primary-color)';
	}};
	transition: 0.3s;
	cursor: pointer;
	font-weight: ${(props: StyledLinkProps) => (props.bold ? 'bold' : '')};
	display: ${(props: StyledLinkProps) => (props.block ? 'block' : 'inline')};

	&:hover {
		color: #0059ac;
		text-decoration-line: underline;
	}
`;