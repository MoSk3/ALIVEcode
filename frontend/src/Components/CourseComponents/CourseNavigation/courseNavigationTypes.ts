import styled from 'styled-components';
import { themes } from '../../../state/contexts/ThemeContext';
export type CourseNavigationProps = {};

export const StyledCourseNavigation = styled.div`
	color: white;

	/* Navbar size */
	height: calc(100vh - 56px);
	width: 20vw;
	left: 0;
	box-sizing: content-box;
	position: fixed;

	${({ isNavigationOpen }: { isNavigationOpen: boolean }) =>
		isNavigationOpen ? `margin-left: 0;` : `margin-left: -20vw;`}

	${({ theme }) =>
		theme.name === themes.light.name &&
		'border-right: 1px solid rgb(161, 161, 161);'}
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	transition: all 0.35s;
	background-color: ${({ theme }) => {
		if (theme.name === themes.light.name) return 'var(--background-color)';
		if (theme.name === themes.dark.name) return 'var(--fourth-color)';
	}};
	color: ${({ theme }) => {
		if (theme.name === themes.light.name) return 'var(--background-color)';
		if (theme.name === themes.dark.name) return 'var(--foreground-color)';
	}};
	overflow-y: auto;
	touch-action: auto;
	z-index: 10;

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
		background-color: ${({ theme }) => {
			if (theme.name === themes.light.name) return 'var(--secondary-color)';
			if (theme.name === themes.dark.name) return 'var(--primary-color)';
		}};
	}

	.course-activity {
		width: 100%;
		margin-top: 5px;
		padding: 10px;
		background-color: ${({ theme }) => {
			if (theme.name === themes.light.name) return 'var(--third-color)';
			if (theme.name === themes.dark.name) return 'var(--secondary-color)';
		}};
	}

	.course-section-body {
		width: 80%;
	}

	.course-section-header:hover,
	.course-activity:hover {
		background-color: var(--contrast-color);
	}
`;
