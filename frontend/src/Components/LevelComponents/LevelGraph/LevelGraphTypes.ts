import styled from 'styled-components';
import FillContainer from '../../UtilsComponents/FillContainer/FillContainer';

export interface LevelGraphProps {
  data: any;
}

export const StyledLevelGraph = styled(FillContainer)`
  .container {
    width: fit-content;
    height: fit-content;
    background: white;
  }

`