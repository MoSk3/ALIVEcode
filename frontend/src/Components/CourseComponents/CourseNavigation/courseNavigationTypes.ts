import styled from 'styled-components';
import { themes } from '../../../state/contexts/ThemeContext';
export type CourseNavigationProps = {};

export const StyledDiv = styled.div`
	color: white;
	height: 100%;
	width: 20%;
	position: fixed;
	box-sizing: content-box;
	${({ theme }) =>
		theme.name === themes.light.name &&
		'border-right: 1px solid rgb(161, 161, 161);'}
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	transition: 0.35s;
	transform: translateX(-85%);
	background-color: var(--fourth-color);
	color: var(--background-color);
	overflow-y: auto;
	touch-action: auto;
	z-index: 10;

	&:hover {
		transform: translateX(0%);
	}

	.course-nav-title {
		padding: 10px 5px 10px 5px;
		font-size: 25px;
		color: var(--foreground-color);
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
