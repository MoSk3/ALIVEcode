import styled from "styled-components";
import { CourseContentProps } from "./courseContentTypes";
import { useContext } from 'react';
import {
	Theme,
	ThemeContext,
	themes,
} from '../../../state/contexts/ThemeContext';

const StyleDiv = styled.div`
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

const CourseContent = (props: CourseContentProps) => {
	const { theme } = useContext(ThemeContext);
	return (
		<StyleDiv theme={theme}>
			<div className="course-content-padding">
				<div className="course-content">
					<h1>hello</h1>
					<div>
						<p>Contenu d'un cours!</p>
					</div>
				</div>
			</div>
		</StyleDiv>
	);
};

export default CourseContent;