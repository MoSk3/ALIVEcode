import styled from 'styled-components';
import { useLayoutEffect, useRef } from 'react';
import { FillContainerProps } from './fillContainerTtypes';

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`

const FillContainer = ({ centered, startAtTop, children, style, className, relative, id }: FillContainerProps) => {
  const styledContainerRef = useRef<any>(null);

  const finalStyles = {
    ...style, ...(centered ? {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    } : {}), ...(startAtTop ? {
      top: '0'
    } : {})
  };

  useLayoutEffect(() => {

    const resizeDiv = () => {
      if (styledContainerRef !== null && styledContainerRef.current !== null) {
        if (relative) {
          styledContainerRef.current.style.height = styledContainerRef.current.parentNode.closest('div').clientHeight + "px";
        }
        else {
          if (startAtTop) {
            styledContainerRef.current.style.height = window.innerHeight + "px";
          } else {
            const navbar = document.getElementById('navbar');
            if (navbar)
              styledContainerRef.current.style.height = (window.innerHeight - navbar.clientHeight) + "px";
          }
        }
      }
    }

    window.addEventListener('resize', resizeDiv)
    resizeDiv()
    setTimeout(resizeDiv, 50);

    return () => {
      window.removeEventListener('resize', resizeDiv);
    };
  });

  return (
    <StyledContainer id={id} className={className} style={finalStyles} ref={styledContainerRef}>
      {children}
    </StyledContainer>
  );
}

export default FillContainer;