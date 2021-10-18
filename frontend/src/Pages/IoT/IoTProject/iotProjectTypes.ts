import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';

export type IoTProjectTabs = 'settings' | 'routes' | 'access';

type RouteProps = {
	id: string;
};

export interface IoTProjectProps extends RouteComponentProps<RouteProps> {}

export const StyledIoTProject = styled(FillContainer)`
	overflow-y: hidden;

	#project-details {
		height: 100%;
		background-color: var(--background-color);
		border-right: 1px solid rgba(var(--foreground-color-rgb), 0.4);
		position: relative;
	}

	#project-body {
		height: 100%;
		background-color: var(--background-color);
	}

	.project-top-row {
		height: 50px;
		padding: 10px !important;
		border-bottom: 1px solid rgba(var(--foreground-color-rgb), 0.4);
	}

	.project-name {
		font-size: 1.2em;
		height: 50px;
		padding: 10px !important;
		border-bottom: 1px solid rgba(var(--foreground-color-rgb), 0.4);
	}

	.project-details-body {
		height: 100%;
	}

	.project-details-tabs {
		width: 70px;
		flex-grow: 0;
		text-align: center;
	}

	.project-details-tab {
		width: 70px;
		height: 70px;
		padding: 10px !important;
		background-color: var(--background-color);
		font-size: 0.75em;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		transition: 0.05s;
		cursor: pointer;
	}

	.project-details-tab-selected {
		background-color: rgba(var(--secondary-color-rgb), 0.7);
	}

	.project-details-tab:hover {
		background-color: var(--secondary-color);
	}

	.project-details-content {
		border-left: 1px solid rgba(var(--foreground-color-rgb), 0.4);
		padding: 10px !important;
	}

	.project-details-content-header {
		border-bottom: 1px solid rgba(var(--foreground-color-rgb), 0.4);
		font-size: 1.2em;
		height: 40px;
		margin-bottom: 20px;
	}

	.disabled-text {
		color: rgba(var(--foreground-color-rgb), 0.5);
	}

	.my-progress {
		position: relative;
		margin: 4px;
		float: left;
		text-align: center;
	}
	.barOverflow {
		/* Wraps the rotating .bar */
		position: relative;
		overflow: hidden; /* Comment this line to understand the trick */
		width: 180px;
		height: 90px; /* Half circle (overflow) */
		margin-bottom: -14px; /* bring the numbers up */
	}
	.bar {
		position: absolute;
		top: 0;
		left: 0;
		width: 180px;
		height: 180px; /* full circle! */
		border-radius: 50%;
		box-sizing: border-box;
		border: 15px solid #bbb; /* half gray, */
		border-bottom-color: #fbff00; /* half azure */
		border-right-color: #fbff00;
		transform: rotate(45deg);
		transition: 0.2s;
	}

	.my-progress-span {
		position: relative;
		font-size: 1.2em;
		bottom: 20px;
	}

	.row,
	.col,
	.col-sm-8,
	.col-sm-4 {
		padding: 0;
		margin: 0;
	}
`;