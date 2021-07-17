import FillContainer from '../../../Components/MainComponents/FillContainer/FillContainer';
import { SignUpMenuProps } from './signUpMenuTypes';
import SignUpCard from '../SignUpCard/SignUpCard';
import { Row } from 'react-bootstrap';

import StudentImg from "../../../assets/images/icons/student.png";
import ProfessorImg from "../../../assets/images/icons/teacher.png";

const SignUpMenu = (props: SignUpMenuProps) => {


  return (
    <FillContainer startAtTop centered>
      <Row>
        <SignUpCard img={StudentImg} to="/signup-student" />
        <SignUpCard img={ProfessorImg} to="/signup-professor" />
      </Row>
    </FillContainer>
  );
}

export default SignUpMenu;