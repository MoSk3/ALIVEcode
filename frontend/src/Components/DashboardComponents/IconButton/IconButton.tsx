import { IconButtonProps } from './iconButtonTypes';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledButton = styled.button`
  background-color: var(--third-color);
  border: none;
  border-radius: 10px;
  color: white;
  padding: 2px 2px;
  transition: 0.2s;
`

const IconButton = (props: IconButtonProps) => {

  return (
    <StyledButton>
      <FontAwesomeIcon fixedWidth {...props} />
    </StyledButton>
  );
}

export default IconButton;