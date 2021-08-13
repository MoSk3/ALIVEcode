import { useTranslation } from 'react-i18next';

const InfoBox = (props:any) => {
  const {t} = useTranslation();

  return (
    <div id="container">
      <div id="section-title">Le potentiel de l'intelligence artificielle</div>
      <p id="section-description">Ici apparaîtra les informations concernant l'intelligence artificielle</p>
    </div>
  );
}

export default InfoBox