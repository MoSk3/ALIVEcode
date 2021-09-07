import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import { SignUpMenuProps } from './signUpMenuTypes';
import Card from '../../../Components/UtilsComponents/Cards/Card/Card';
import { Row } from 'react-bootstrap';

import StudentImg from '../../../assets/images/icons/student.png';
import ProfessorImg from '../../../assets/images/icons/teacher.png';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

const SignUpMenu = (props: SignUpMenuProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<FillContainer startAtTop centered>
			<Row>
				<Card
					img={StudentImg}
					to={routes.non_auth.signup_student.path}
					title={t('msg.auth.signup_student')}
				/>
				<Card
					img={ProfessorImg}
					to={routes.non_auth.signup_professor.path}
					title={t('msg.auth.signup_professor')}
				/>
			</Row>
		</FillContainer>
	);
};

export default SignUpMenu;