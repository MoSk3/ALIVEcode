import { AboutProps } from './aboutTypes';
import FillContainer from '../../Components/UtilsComponents/FillContainer/FillContainer';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useTranslation } from 'react-i18next';
import AboutCard from '../../Components/UtilsComponents/Cards/AboutCard/AboutCard';
import { Row } from 'react-bootstrap';

const About = (props: AboutProps) => {
	const { t } = useTranslation();

	return (
		<FillContainer startAtTop centered>
			<CardContainer title={t('msg.section.about')}>
				<div>
					<Row>
						<AboutCard name="Jihène Rezgui" img="lol" />
					</Row>
					<Row>
						<AboutCard name="Jihène Rezgui" img="lol" />
						<AboutCard name="Jihène Rezgui" img="lol" />
						<AboutCard name="Jihène Rezgui" img="lol" />
						<AboutCard name="Jihène Rezgui" img="lol" />
						<AboutCard name="Jihène Rezgui" img="lol" />
						<AboutCard name="Jihène Rezgui" img="lol" />
						<AboutCard name="Jihène Rezgui" img="lol" />
						<AboutCard name="Jihène Rezgui" img="lol" />
					</Row>
				</div>
			</CardContainer>
		</FillContainer>
	);
};

export default About;