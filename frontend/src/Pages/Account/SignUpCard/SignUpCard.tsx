import { SignUpCardTypes } from './signUpCardtypes';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const MenuButton = styled.div`
  position: relative;
  background-color: var(--primary-color);
  box-shadow: 0px 15px 30px rgb(131, 131, 131);
  margin: 25px 50px;
  width: 300px;
  height: 380px;
  vertical-align: center;
  text-align: center;
  transition: 0.2s;
  cursor: pointer;
  border-radius: 20px;

  &:hover {
    transform: rotate(5deg) scale(1.2);
    background-color: var(--third-color);
    box-shadow: 0px 5px 30px rgb(131, 131, 131);
  }

  .padded-button {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .logo-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: 60%;
  }

  .logo-button div {
    position: relative;
    width: 70%;
    height: 70%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
  }

  .text-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: 35%;
  }

  .text-button div {
    position: relative;
    font-size: 220%;
    color: white;
    width: 90%;
    text-align: center;
    vertical-align: middle;
  }
`


const SignUpCard = ({ img, to }: SignUpCardTypes) => {
  const history = useHistory();

  return (
    <MenuButton onClick={() => to && history.push(to)}>
      <div className="padded-button">
        <div className="logo-button">
          <div style={{ backgroundImage: `url(${img})` }}></div>
        </div>
        <div className="text-button">
          <div>Compte étudiant</div>
        </div>
      </div>
    </MenuButton>
  );
}

export default SignUpCard;