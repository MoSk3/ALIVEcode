import { GamepadProp } from "./gamepad";
import './gamepad.css';


const Gamepad = (props: GamepadProp) => {
    document.body.onkeydown = (e) =>{
        if(e.key == 'Space'){
            $("#btnStart").addClass('push');
        }
        if(e.key == 'S'){
            $("#btnA").addClass('push');
        }
        if(e.key == 'X'){
            $("#btnB").addClass('push');
        }
        if(e.key == 'Z'){
            $("#btnX").addClass('push');
        }
        if(e.key == 'C'){
            $("#btnY").addClass('push');
        }
    }
    document.body.onkeyup = (e) => {
        if(e.key == 'Space'){
            $("#btnStart").removeClass('push');
        }
        if(e.key == 'S'){
            $("#btnA").removeClass('push');
        }
        if(e.key == 'X'){
            $("#btnB").removeClass('push');
        }
        if(e.key == 'Z'){
            $("#btnX").removeClass('push');
        }
        if(e.key == 'C'){
            $("#btnY").removeClass('push');
        }
    } 

    return (

        <><div className="container">
            <img src="controller.png" />
            <div>
                <button className="button" id="btnStart">Start</button>
            </div>

            <div>
                <button className="button" id="btnA">A</button>
            </div>

            <div>
                <button className="button" id="btnB">B</button>
            </div>

            <div>
                <button className="button" id="btnX">X</button>
            </div>

            <div>
                <button className="button" id="btnY">Y</button>
            </div>
        </div>
        
        <div>
                <button className="button" id="abc">TEST</button>
            </div></>
    )

};

export default Gamepad