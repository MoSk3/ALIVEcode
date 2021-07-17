import styled from 'styled-components';
import { useRef } from 'react';
import { CenteredContainerProps, StyledCenteredContainerProps } from './centeredContainerTtypes';

const StyledContainer = styled.div`
  width: 100%;
  position: relative;
  text-align: ${(props: StyledCenteredContainerProps) => props.textAlign || 'inherit'};
`

const CenteredContainer = ({ vertically, horizontally, startAtTop, textAlign, children, style, className }: CenteredContainerProps) => {
  const styledContainerRef = useRef<any>(null);

  const finalStyles = {
    ...style, ...(vertically ? {
      display: 'flex',
      alignItems: 'center',
    } : {}),  ...(horizontally ? {
      display: 'flex',
      justifyContent: 'center',
    } : {}), ...(startAtTop ? {
      top: '0',
    } : {})
  };

  return (
    <StyledContainer textAlign={textAlign} className={className} style={finalStyles} ref={styledContainerRef}>
      <div>
        {children}
      </div>
    </StyledContainer>
  );
}

export default CenteredContainer;