import { AliveIaProps } from './AliveIaTypes';
import Test from "../../Components/ALIVEIAComponents/Test/Test";
import { useTranslation } from 'react-i18next';
import HeaderAI from '../../Components/ALIVEIAComponents/Header/HeaderAI';
import InfoBox from '../../Components/ALIVEIAComponents/InfoBox/InfoBox';

import '../../Components/ALIVEIAComponents/Header/headerAI.css';
import '../../Components/ALIVEIAComponents/InfoBox/infoBox.css';

const AliveIa = (props: AliveIaProps) => {
  const {t} = useTranslation();

  return (
    <>
      <HeaderAI/>
      <InfoBox/>
    </>
  );
}

export default AliveIa;