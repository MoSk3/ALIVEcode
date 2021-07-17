import { HomeProps } from './homeTypes';
import Footer from '../../Components/MainComponents/Footer/Footer';
import { useHistory } from 'react-router';
import { Container } from 'react-bootstrap';
import HomeCard from '../../Components/MainComponents/HomeCard/HomeCard';

import './home.css';
import '../../assets/css/maisonneuve_background.css';

import Voiture from '../../assets/images/Voiture.gif';
import Cloud from '../../assets/images/cloud.png';
import Maze from '../../assets/images/Labyrinthe.jpg';
import LRIMA from '../../assets/images/LRIMA.png';
import TypeWriter from '../../Components/MiscComponents/TypeWriter/TypeWriter';

const Home = (props: HomeProps) => {

	const history = useHistory();

	return (
		<>
			<div className="header" style={{top: '-50px'}}>
				<h1>A.L.I.V.E.</h1>
				<TypeWriter
					lines={[
						"Apprendre la programmation",
						"Apprendre en jouant",
						"Apprendre les concepts de l'IA",
					]}
					typeSpeed={80}
					eraseSpeed={50}
					shadow
				/>

				<div id="arrow">
					<svg onClick={() => history.push('/dashboard')} data-name="arrow" xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24">
						<g data-name="Arrow Left">
							<path style={{ fill: "white" }}
								d="M7.77,23.58l-2.24-2a0.5,0.5,0,0,1,0-.71L13.43,12,5.5,3.13a0.5,0.5,0,0,1,0-.71l2.24-2a0.5,0.5,0,0,1,.71,0L18.8,12,8.48,23.54A0.5,0.5,0,0,1,7.77,23.58Z" />
						</g>
					</svg>
				</div>
			</div>
			<Container>
				<Container fluid>
					<HomeCard
						title="ALIVE PLAY"
						content="Dans cette section, vous pourrez créer vos propres niveaux ou jouer les
                        niveaux des autres utilisateurs!"
						to="/playground"
						img={Voiture}
					/>
					<HomeCard
						title="ALIVE Mind Controller"
						content="Dans cette activité, vous auriez la possibilité de controller une voiture à
                        l'aide de votre pensée!"
						to="/mind"
						img={Cloud}
					/>
					<HomeCard
						title="Augmented Vehicle Perception"
						content="En construction."
						img={Maze}
					/>
					<HomeCard
						title="Le laboratoire de recherche LRIMA"
						content="Site officiel du laboratoire de recherche informatique de Maisonneuve
                        LRIMA."
						onClick={() => window.open('https://lrima.cmaisonneuve.qc.ca/', '_blank')}
						img={LRIMA}
					/>
				</Container>
			</Container>
			<Footer />
		</>
	)
};

export default Home;