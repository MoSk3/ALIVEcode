import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

/**
 * Ce composant correspond à l'en-tête de la page d'accueil de la section IA du site web. 
 * Elle comprend donc le titre de la page, sa description et l'image de fond.
 */

//CSS de HeaderAI
const StyledHeader = styled.div`
  & {
    width: 100%;
    height: 70vh;
    background-color: var(--primary-color);
  }

  .header-text {
    display: flex;
    flex-direction: column;
    padding-top: 8vh;
    padding-bottom: 8vh;
    color: var(--background-color);
  }

  .title {
    font-size: 8vh;
    padding-left: 10vw;
    padding-right: 25vw;
  }

  .presentation-paragraph {
    padding-left: 10vw;
    padding-right: 35vw;
    font-size: 14px;
    color: #ffffffbe;
  }

  @media screen and (max-width: 1100px) {
    & {
      height: 90vh;
    }
    .presentation-paragraph {
      font-size: 12px;
    }
  }

  @media screen and (max-width: 600px) {
    & {
      height: 110vh;
    }
  }
`
/**
 * Méthode retournant le HeaderAI défini par cette méthode même et ses propriétés CSS.
 * @param props aucune propriété pour ce composant.
 * @returns un HeaderAI.
 */
const HeaderAI = (props:any) => {
  const {t} = useTranslation();

  return (
    <StyledHeader>
      <div className="header-text">
        <h1 className="title">
          {t('ai.header.title')}
        </h1>
        <p className="presentation-paragraph">
          {t('ai.header.description')}
        </p>
      </div>
    </StyledHeader>
  );
}

export default HeaderAI