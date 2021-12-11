import styled from 'styled-components';
import { Container } from 'react-bootstrap';
export type DashboardNewProps = {};

export const StyledDashboard = styled(Container)`
	display: table;
	height: 100%;
	width: 100%;
	box-sizing: border-box;

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
		background-color: red;
	}
`;