import { FormContainerProps } from './formContainerTypes';
import styled from 'styled-components';
import FillContainer from '../FillContainer/FillContainer';

const StyledCenteredContainer = styled.div`
	position: absolute;
	border-radius: 20px;
	background-color: var(--primary-color);
	box-shadow: 0px 15px 30px rgb(160, 160, 160);
	padding: 60px;
	color: white;
`;

const FormContainer = ({ children, title }: FormContainerProps) => {
	return (
		<FillContainer centered>
			<StyledCenteredContainer>
				<h1 style={{ marginBottom: '30px' }}>{title}</h1>
				{children}
			</StyledCenteredContainer>
		</FillContainer>
	);
};

export default FormContainer;