import { render } from "@testing-library/react";
import React, { useState } from 'react';
import { KeyboardEvent } from "react";
import { GamepadProp } from "./gamepad";
import controller from '../../assets/images/controller.png';

import './gamepad.css';
import { Col, Container } from "react-bootstrap";
import AboutCard from "../UtilsComponents/Cards/AboutCard/AboutCard";
import styled from "styled-components";


const StyledDiv = styled(Col)`
width: 500px;
height: 300px;

	img {
		border-radius: 20px;
		width: 500px;
		height: 300px;
	}
`;

const GamepadAlive = () => {
    document.body.onkeydown = (e) => {
        if (e.code == 'Space') {
            document.getElementById('btnStart')?.classList.add('push')       
        }
        if (e.code == 'KeyS') {
            document.getElementById('btnA')?.classList.add('push')        
        }
        if (e.code == 'KeyX') {
            document.getElementById('btnB')?.classList.add('push')       
        }
        if (e.code == 'KeyZ') {
            document.getElementById('btnX')?.classList.add('push')       
        }
        if (e.code == 'KeyC') {
            document.getElementById('btnY')?.classList.add('push')       
        }
    }



    document.body.onkeyup = (e) => {
        if (e.code == 'Space') {
            document.getElementById('btnStart')?.classList.remove('push')
        }
        if (e.code == 'KeyS') {
            document.getElementById('btnA')?.classList.remove('push')       
         }
        if (e.code == 'KeyX') {
            document.getElementById('btnB')?.classList.remove('push')       

        }
        if (e.code == 'KeyZ') {
            document.getElementById('btnX')?.classList.remove('push')       

        }
        if (e.code == 'KeyC') {
              document.getElementById('btnY')?.classList.remove('push')       

        }
    }

    return (

        <><Container className="container-sm">
<StyledDiv>
			<img src={controller} alt= "" />
            
                <button 
                className="button btnStart" id="btnStart">Start</button>
           

          
                <button className="button btnA" id="btnA">A</button>
           

           
                <button className="button btnB" id="btnB">B</button>
           

          
                <button className="button btnX" id="btnX">X</button>
         

           
                <button className="button btnY" id="btnY">Y</button>
            
		</StyledDiv>            
           
        </Container>
</>

    )

};

export default GamepadAlive



  
/*const Gamepad = () => {
  const [state, setState] = useState('');
    
  const handler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // changing the state to the name of the key
    // which is pressed
    setState(event.key);
  };
    
  return (
    <div>
      <h1>Hi Geeks!</h1>
        
<p>Key pressed is: {state}</p>
  
        
    
      <input type="text" onKeyPress={(e) => handler(e)} />
        
    </div>
  );
};
  
export default Gamepad;*/