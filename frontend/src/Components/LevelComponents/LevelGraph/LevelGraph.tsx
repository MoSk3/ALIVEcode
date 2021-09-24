import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { LevelGraphProps, StyledLevelGraph } from './LevelGraphTypes';
import { Scatter } from 'react-chartjs-2';
import FillContainer from '../../UtilsComponents/FillContainer/FillContainer';
import { themes } from '../../../state/contexts/ThemeContext';
import { Chart } from 'react-chartjs-2';

/**
 * This constant defines all general characteristics of a graph in AI levels. The graph is
 * implemented with Chart.js and all of the parameters defining it are set below.
 * @param props the properties of a graph :
 *    - data: a javascript object, the data to present on the graph.
 *    - title: a string, the title of the graph.
 *    - xAxis: a string, the title of the X axis.
 *    - yAxis: a string, the title of the Y axis.
 * @returns the graph itself.
 */
const LevelGraph = (props: LevelGraphProps) => {
  const {t} = useTranslation();
  
  Chart.defaults.font.size = 12;
  Chart.defaults.font.weight = "bold";
  Chart.defaults.color = "black";


  return (
    <StyledLevelGraph>
        <Scatter
          className="graph"
          data={props.data} 
          options={{
            aspectRatio: 1.5,
            layout: {
              padding: {
                left: 25,
                right: 10
              }
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: props.xAxis,
                  align: "center",
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: props.yAxis,
                  align: "center"
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: props.title,
                font: {
                  size: 28,
                }
              },
              legend: {
                display: false,
              }
            }
          }}
        />
    </StyledLevelGraph>
  );
};

export default LevelGraph;