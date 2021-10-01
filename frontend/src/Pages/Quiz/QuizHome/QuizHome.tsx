import useRoutes from '../../../state/hooks/useRoutes';
import { useHistory } from 'react-router';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import SmallCard from '../../../Components/UtilsComponents/Cards/SmallCard/SmallCard';

const QuizHome = () => {
	const { routes } = useRoutes();
	const history = useHistory();

	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<CardContainer asRow style={{ marginBottom: '100px' }} title="Quiz">
					<SmallCard to="/quiz" title="IoT" />
					<SmallCard to="/quiz/new" title="Base de données" />
					<SmallCard to="/quiz/browse" title="Pseudocode" />
					<SmallCard to="/quiz/browse" title="Réseaux" />
					<SmallCard to="/quiz/browse" title="Ajouter un Quiz" />
				</CardContainer>
			</CenteredContainer>
		</div>
	);
};

export default QuizHome;