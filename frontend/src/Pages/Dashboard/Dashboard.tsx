import { DashboardProps } from './dashboardTypes';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import LabelHighlight from '../../Components/UtilsComponents/LabelHighlight/LabelHighlight';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useHistory } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ClassroomCard from '../../Components/DashboardComponents/ClassroomCard/ClassroomCard';
import SmallCard from '../../Components/UtilsComponents/Cards/SmallCard/SmallCard';
import { Database } from '../../Models/Model';
import useFetch from '../../state/hooks/useFetch';

import List from '../../assets/images/icons/my_levels.png';
import Puzzle from '../../assets/images/icons/puzzle.png';
import Sandbox from '../../assets/images/icons/sandboxblanc.png';
import Voiture from '../../assets/images/Voiture.gif';
import { Row } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = (props: DashboardProps) => {
	const { user } = useContext(UserContext);

	const history = useHistory();
	const [classrooms, loading] = useFetch(
		Database.playground.classrooms.ofCurrentUser,
	);

	useEffect(() => {
		const getData = async () => {
			try {
				console.log((await axios.get('/users/me')).data);
			} catch {
				console.log('NOT LOGGED IN');
			}
		};

		getData();
	}, []);

	const createLevel = async () => {
		// TODO : axios request to return new level with id
		// const level: Level;
		// history.push(`/level/play/${level.id}`)
	};

	return (
		<CenteredContainer
			horizontally
			textAlign="center"
			style={{ paddingLeft: '100px', paddingRight: '100px' }}
		>
			<Row style={{ justifyContent: 'center' }}>
				<LabelHighlight
					text={`Bonjour, ${user?.getDisplayName()}`}
					textColor="white"
					padding="25px"
					borderRadius="25px"
					fontSize="45px"
				/>
			</Row>
			<CardContainer
				title="Mes classes"
				style={{ marginTop: '20px' }}
				onIconClick={() => history.push('/playground/join-classroom')}
				icon={faPlus}
			>
				{loading
					? 'Loading...'
					: classrooms?.map((classroom, idx) => (
							<ClassroomCard key={idx} classroom={classroom} />
					  ))}
			</CardContainer>

			<CardContainer title="Niveaux">
				<SmallCard to="/level" title="Mes niveaux" img={List} />
				<SmallCard
					onClick={() => createLevel}
					title="Créer un niveau"
					img={Sandbox}
				/>
				<SmallCard to="/level/browse" title="Jouer un niveau" img={Voiture} />
			</CardContainer>

			<CardContainer style={{ marginBottom: '100px' }} title="Niveaux">
				<SmallCard to="/quiz" title="Mes quiz" img={List} />
				<SmallCard to="/quiz/new" title="Créer un quiz" img={Sandbox} />
				<SmallCard to="/quiz/browse" title="Jouer un quiz" img={Puzzle} />
			</CardContainer>
		</CenteredContainer>
	);
};

export default Dashboard;