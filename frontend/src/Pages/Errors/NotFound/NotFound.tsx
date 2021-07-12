import './NotFound.css';
import Link from '../../../Components/MainComponents/Link/Link';

import VoitureGIF from "../../../assets/images/Voiture.gif";
import FillContainer from '../../../Components/MainComponents/FillContainer/FillContainer';

export const NotFound = () => {
	return (
		<FillContainer style={{ textAlign: 'center' }} startAtTop centered>
			<div>
				<h1>Désolé.</h1>
				<h2>Cette page n'existe pas.</h2>
				<img
					src={VoitureGIF} alt="Voiture ALIVE"
				/>
				<div>
					<Link to="/" dark bold>Retour à l'accueil.</Link>
				</div>
			</div>
		</FillContainer>
	)
}