import styled from 'styled-components';
import { Container } from 'react-bootstrap';
export type DashboardNewProps = {};

export const StyledDashboard = styled.div`
	display: table;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	background-color: var(--background-color);

	.row {
		position: relative;
		height: 100%;
		display: table-row;
	}

	.row .no-float {
		display: table-cell;
		float: none;
	}

	.sidebar {
		border-right: 1px solid var(--bg-shade-four-color);
		padding: 0;
	}

	.sidebar label {
		margin-bottom: 0;
	}

	.sidebar-btn {
		color: var(--foreground-color);
		font-weight: 400;
		padding: 10px 10px 10px 10px;
		cursor: pointer;
		transition: all 0.1s;
	}

	.sidebar-btn:hover {
		background-color: var(--bg-shade-one-color);
	}

	.sidebar-btn-selected {
		background-color: var(--secondary-color) !important;
	}

	.sidebar-btn-text {
		font-size: 0.7em;
		height: 20px;
		cursor: pointer;
	}

	.sidebar-icon {
		margin-right: 10px;
	}

	.sidebar-icon-right {
		position: relative;
	}

	.sidebar-header {
		color: var(--foreground-color);
		font-weight: 400;
		padding: 10px 10px 10px 10px;
		margin-top: 10px;
	}

	.sidebar-header-text {
		font-size: 0.9em;
		height: 20px;
	}

	hr {
		margin-top: 10px;
		width: 85%;
	}
`;