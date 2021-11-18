import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import Card from '../../../Components/UtilsComponents/Cards/Card/Card';
import { Row } from 'react-bootstrap';

import Voiture from '../../../assets/images/Voiture.gif';
import Code from '../../../assets/images/icons/sandboxblanc.png';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

/**
 * Menu to select which type of level to create
 *
 * @author MoSk3
 */
const LevelFormMenu = () => {
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<FillContainer startAtTop centered>
			<Row style={{ justifyContent: 'center' }}>
				<Card
					img={Voiture}
					to={routes.auth.level_create_alive.path}
					title={t('menu.level.alive')}
				/>
				<Card
					img={Code}
					to={routes.auth.level_create_code.path}
					title={t('menu.level.code')}
				/>
				<Card
					img={Code}
					to={routes.auth.level_create_ai.path}
					title={t('menu.level.ai')}
				/>
				<Card
					img={Code}
					to={routes.auth.level_create_iot.path}
					title={t('menu.level.iot')}
				/>
			</Row>
		</FillContainer>
	);
};

export default LevelFormMenu;