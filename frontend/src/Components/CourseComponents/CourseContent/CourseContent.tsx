import styled from "styled-components";
import { CourseContentProps } from "./courseContentTypes";

const StyleDiv = styled.div`
	position: relative;
	left: 3%;
	height: 100%;
	width: 97%;

	.course-content-padding {
		padding: 30px;
		background-color: rgba(255, 255, 255, 0.5);
		height: 100%;
	}

	.course-content {
	}
`;

const CourseContent = (props: CourseContentProps) => {
	return (
		<StyleDiv>
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