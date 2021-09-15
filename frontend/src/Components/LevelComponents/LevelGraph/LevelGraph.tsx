import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { LevelGraphProps } from './LevelGraphTypes';
import { Scatter } from 'react-chartjs-2';
import FillContainer from '../../UtilsComponents/FillContainer/FillContainer';
import { themes } from '../../../state/contexts/ThemeContext';


const LevelGraph = (props: LevelGraphProps) => {
  const {t} = useTranslation();
  

  return (
    <Scatter
      className="graph"
      data={props.data} 
      options={{
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "X axis",
              align: "end"
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Y axis",
              align: "end"
            }
          }
        },
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