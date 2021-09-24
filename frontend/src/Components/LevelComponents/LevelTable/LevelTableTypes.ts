import styled from "styled-components";
import FillContainer from '../../UtilsComponents/FillContainer/FillContainer';

export interface LevelTableProps {
  data: any;
  xData: string;
  yData: string;
}

export const StyledLevelTable = styled(FillContainer)`
  
  tbody {
    font-size: 11px;
    border-style: none;
  }

  table {
    padding: 6px;
    background-color: whitesmoke;
    text-align: center;
  }
  .titles {
    font-size: 13px;
    font-weight: bolder;
    background-color: var(--secondary-color);
    border-style: none;
  }
  .data {
    background-color: whitesmoke;
    border-top: 0.2vh solid gray;
  }
  .data-number {
    background-color: skyblue;
    border-top: 0.2vh solid gray;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    margin-right: 60px;
    margin-top: 25px;
    overflow: auto;
    max-height: 50vh;
  }

  td {
    padding: 6px;
    text-align: center;
    justify-content: center;
  }
`