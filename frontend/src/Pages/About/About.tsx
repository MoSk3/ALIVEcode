import { AboutProps } from './aboutTypes';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useTranslation } from 'react-i18next';
import AboutCard from '../../Components/UtilsComponents/Cards/AboutCard/AboutCard';
import { Row } from 'react-bootstrap';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';

import Jihene from '../../assets/images/creators/Jihene.jpg';
import Enric from '../../assets/images/creators/Enric.jpg';
import Mathis from '../../assets/images/creators/Mathis.jpg';
import Zarine from '../../assets/images/creators/Zarine.jpg';
import Felix from '../../assets/images/creators/Felix.jpg';
import Pablo from '../../assets/images/creators/Pablo.jpg';
import Brian from '../../assets/images/creators/Brian.jpg';
import styled from 'styled-components';

const StyledCenteredContainer = styled(CenteredContainer)`
	padding: 0 10% 0 10%;

	.row-prof {
		padding-top: 10px;
		margin-bottom: 10px;
	}
`;

const About = (props: AboutProps) => {
	const { t } = useTranslation();

	return (
		<StyledCenteredContainer vertically horizontally>
			<CardContainer title={t('msg.section.about')}>
				<Row>
					<AboutCard
						className="row-prof"
						name="Dre. Jihene Rezgui directrice de LRIMa"
						img={Jihene}
					/>
				</Row>
				<Row>
					<AboutCard name="Jihène Rezgui" img={Enric} />
					<AboutCard name="Jihène Rezgui" img={Mathis} />
					<AboutCard name="Jihène Rezgui" img={Zarine} />
					<AboutCard name="Jihène Rezgui" img={Felix} />
					<AboutCard name="Jihène Rezgui" img={Pablo} />
					<AboutCard name="Jihène Rezgui" img={Brian} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
					<AboutCard name="Jihène Rezgui" img={Jihene} />
				</Row>
			</CardContainer>
		</StyledCenteredContainer>
	);
};

export default About;