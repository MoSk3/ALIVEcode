import { AliveIaProps } from './AliveIaTypes';
import Test from "../../Components/ALIVEIAComponents/Test/Test";
import { useTranslation } from 'react-i18next';
import HeaderAI from '../../Components/ALIVEIAComponents/Header/HeaderAI';

import '../../Components/ALIVEIAComponents/Header/headerAI.css';

const AliveIa = (props: AliveIaProps) => {
  const {t} = useTranslation();

  return (
    <>
      <HeaderAI/>
      <p>
        Hello World
      </p>
    </>
  );
}

export default AliveIa;