import { AboutProps } from './aboutTypes';
import FillContainer from '../../Components/UtilsComponents/FillContainer/FillContainer';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useTranslation } from 'react-i18next';
import AboutCard from '../../Components/UtilsComponents/Cards/AboutCard/AboutCard';
import { Row } from 'react-bootstrap';

import Jihene from '../../assets/images/Voiture.gif';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';

const About = (props: AboutProps) => {
	const { t } = useTranslation();

	return (
		<CenteredContainer vertically horizontally>
			<CardContainer title={t('msg.section.about')}>
				<Row>
					<AboutCard name="Jihène Rezgui" img={Jihene} />
				</Row>
				<Row>
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
				</Row>
			</CardContainer>
		</CenteredContainer>
	);
};

export default About;