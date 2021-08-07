import FillContainer from '../../../Components/MiscComponents/FillContainer/FillContainer';
import { SignUpMenuProps } from './signUpMenuTypes';
import Card from '../../../Components/MainComponents/Cards/Card/Card';
import { Row } from 'react-bootstrap';

import StudentImg from '../../../assets/images/icons/student.png';
import ProfessorImg from '../../../assets/images/icons/teacher.png';

const SignUpMenu = (props: SignUpMenuProps) => {
	return (
		<FillContainer startAtTop centered>
			<Row>
				<Card img={StudentImg} to="/signup-student" title="Compte Étudiant" />
				<Card
					img={ProfessorImg}
					to="/signup-professor"
					title="Compte Professeur"
				/>
			</Row>
		</FillContainer>
	);
};

export default SignUpMenu;