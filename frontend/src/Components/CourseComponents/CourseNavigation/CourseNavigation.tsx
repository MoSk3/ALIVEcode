import styled from 'styled-components';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import { CourseNavigationProps } from './courseNavigationTypes';
import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';

const StyledDiv = styled.div`
	color: white;
	height: 100%;
	width: 20%;
	position: fixed;
	box-sizing: content-box;
	border-right: 1px solid rgb(161, 161, 161);
	transition: 0.35s;
	transform: translateX(-85%);
	background-color: var(--pale-color);
	overflow-y: auto;
	touch-action: auto;
	z-index: 10;

	&:hover {
		transform: translateX(0%);
	}

	.course-nav-title {
		padding: 10px 5px 10px 5px;
		font-size: 25px;
	}

	.course-nav-header {
		background-color: var(--primary-color);
	}

	.course-nav-body {
		padding: 15px;
		text-align: left;
	}

	.course-section {
		padding-bottom: 15px;
	}

	.course-section-header,
	.course-activity {
		border-radius: 5px;
		transition: 0.2s;
		cursor: pointer;
	}

	.course-section-header {
		font-size: 18px;
		width: 100%;
		padding: 10px;
		background-color: var(--secondary-color);
	}

	.course-activity {
		width: 100%;
		margin-top: 5px;
		padding: 10px;
		background-color: var(--third-color);
	}

	.course-section-body {
		width: 80%;
	}

	.course-section-header:hover,
	.course-activity:hover {
		background-color: var(--contrast-color);
	}

	@media screen and (max-width: 1000px) {
		& {
			width: 35%;
		}
	}

	@media screen and (max-width: 600px) {
		& {
			width: 45%;
		}
	}

	@media screen and (max-width: 400px) {
		& {
			width: 70%;
		}
	}
`;

const CourseNavigation = (props: CourseNavigationProps) => {
	const { course } = useContext(CourseContext);

	return (
		<StyledDiv>
			<CenteredContainer horizontally>
				<div className="course-nav-header">
					<div className="course-nav-title">{course?.name}</div>
				</div>
				<div className="course-nav-body">
					{/*

					{course?.sections.map((s, idx) => (
						<CourseSection key={idx} section={s} />
					))}
					*/}
				</div>
			</CenteredContainer>
		</StyledDiv>
	);
};

export default CourseNavigation;