import { DashboardProps } from './dashboardTypes';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import LabelHighlight from '../../Components/UtilsComponents/LabelHighlight/LabelHighlight';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useHistory } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ClassroomCard from '../../Components/DashboardComponents/ClassroomCard/ClassroomCard';
import SmallCard from '../../Components/UtilsComponents/Cards/SmallCard/SmallCard';
import List from '../../assets/images/icons/my_levels.png';
import Puzzle from '../../assets/images/icons/puzzle.png';
import Sandbox from '../../assets/images/icons/sandboxblanc.png';
import Voiture from '../../assets/images/Voiture.gif';
import { Row } from 'react-bootstrap';
import { Classroom } from '../../Models/Classroom/classroom.entity';
import { plainToClass } from 'class-transformer';
import axios from 'axios';
import { Professor } from '../../Models/User/user.entity';
import useRoutes from '../../state/hooks/useRoutes';

const Dashboard = (props: DashboardProps) => {
	const { user } = useContext(UserContext);
	const [loading, setLoading] = useState(true);
	const [classrooms, setClassrooms] = useState<Classroom[]>([]);
	const history = useHistory();
	const { routes } = useRoutes();

	useEffect(() => {
		const getClassrooms = async () => {
			const data = (await axios.get('classrooms')).data;
			console.log(data);
			setLoading(false);
			setClassrooms(data.map((d: any) => plainToClass(Classroom, d)));
		};
		getClassrooms();
	}, []);

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
				onIconClick={() =>
					history.push(
						user instanceof Professor
							? routes.auth.create_classroom.path
							: routes.auth.join_classroom.path,
					)
				}
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
					to={routes.auth.level_create.path}
					title="Créer un niveau"
					img={Sandbox}
				/>
				<SmallCard
					to={routes.auth.level_browse.path}
					title="Jouer un niveau"
					img={Voiture}
				/>
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