import FillContainer from '../../MiscComponents/FillContainer/FillContainer';
import { useTranslation } from 'react-i18next';

const HeaderAI = (props:any) => {
  const {t} = useTranslation();

  return (
    <div className="background">
      <div id="header-text">
        <h1 id="title">
          {t('ai.header.title')}
        </h1>
        <p id="presentation-paragraph">
          {t('ai.header.description')}
        </p>
      </div>
    </div>
  );
}

export default HeaderAI