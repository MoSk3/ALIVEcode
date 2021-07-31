import { CardContainerProps, StyledCardContainerProps } from './cardContainerTypes';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import styled from 'styled-components';
import { Container, Row } from 'react-bootstrap';
import CenteredContainer from '../../MiscComponents/CenteredContainer/CenteredContainer';

const StyledDiv = styled.div`
  text-align: center;
  margin: 50px 20px 0px 20px;

  h1 {
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    background-color: var(--primary-color);
    color: white;
    margin-bottom: 0px;
    padding: 10px;
  }
  
  .card-container-body {
    overflow-x: ${(({scrollable}: StyledCardContainerProps) => scrollable ? 'auto' : 'none')};
    height: auto;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    background-color: rgba(255, 255, 255, 0.75);
    box-shadow: 0px 15px 30px 0px rgb(170, 170, 170);
  }

  
  @media screen and (max-width : 1076px) {
    text-align: center;
    margin: 50px 20px 0px 20px;
  }
`

const CardContainer = ({ children, title, icon, scrollable, onIconClick, style }: CardContainerProps) => {

  return (
    <StyledDiv style={style} scrollable={scrollable === undefined ? true : scrollable}>
      <div>
        <h1>
          {title} {icon && <IconButton
            icon={icon}
            onClick={onIconClick}
          />}
        </h1>
      </div>
      <Container fluid className="card-container-body">
        <CenteredContainer vertically horizontally>
          <Row className="mt-4 pb-4 pt-2">
            {children}
          </Row>
        </CenteredContainer>
      </Container>
    </StyledDiv>
  );
}

export default CardContainer;