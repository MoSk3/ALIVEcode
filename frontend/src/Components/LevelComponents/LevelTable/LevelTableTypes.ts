import styled from "styled-components";
import FillContainer from '../../UtilsComponents/FillContainer/FillContainer';

export interface LevelTableProps {
	data: any;
	xData: string;
	yData: string;
}

export const StyledLevelTable = styled(FillContainer)`
	td {
		padding: 6px;
		text-align: center;
		justify-content: center;
	}
`;