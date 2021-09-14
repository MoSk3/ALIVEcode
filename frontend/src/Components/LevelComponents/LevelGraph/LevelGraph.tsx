import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { LevelGraphProps } from './LevelGraphTypes';
import { Bar } from 'react-chartjs-2';
import FillContainer from '../../UtilsComponents/FillContainer/FillContainer';


const LevelGraph = (props: LevelGraphProps) => {
  const {t} = useTranslation();
  

  return (
    
      
    <Bar
      data={props.data} 
      options={{
        plugins: {
          title: {
            display: true,
            text: "Premier essai de graphique"
          },
          legend: {
            display: true,
            position: "bottom"
          }
        }
      }}
    />
  );
};

export default LevelGraph;