import { useState, useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import useRoutes from '../../../state/hooks/useRoutes';
import Button from '../../../Components/UtilsComponents/Button/Button';
import { useHistory } from 'react-router';

const QuizHome = () => {
	const [number, setNumber] = useState(0);
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const history = useHistory();

	return (
		<div>
			<label>{number}</label>
			<Button variant="danger" onClick={() => setNumber(number + 1)}>
				Click
			</Button>
			{user ? <div>{user.getDisplayName()}</div> : <div>Not connected</div>}
			<Button
				onClick={() => history.push(routes.auth.account.path)}
				variant="primary"
			></Button>
			{routes.public.test.path}
		</div>
	);
};

export default QuizHome;