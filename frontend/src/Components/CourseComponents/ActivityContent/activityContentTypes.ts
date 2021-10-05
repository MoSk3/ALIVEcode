import styled from 'styled-components';
import { Theme, themes } from '../../../state/contexts/ThemeContext';
export type ActivityContentProps = {};

export const StyledActivityContent = styled.div`
	position: relative;
	left: 3%;
	height: 100%;
	width: 97%;

	.course-content-padding {
		padding: 30px;
		height: 100%;
	}

	.course-content {
		height: 100%;
		padding: 20px;
		border-radius: 5px;
		${({ theme }: { theme: Theme }) =>
			theme.name === themes.light.name &&
			'background-color: rgba(var(--background-color-rgb), 1);'}
	}
`;