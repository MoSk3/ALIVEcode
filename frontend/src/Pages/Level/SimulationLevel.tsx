import FillContainer from '../../Components/MiscComponents/FillContainer/FillContainer';
import { LevelProps } from './simulationLevelTypes';
import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import LineInterface from '../../Components/PlayComponents/LineInterface/LineInterface';
import { UserContext } from '../../UserContext';
import Simulation from '../../Components/PlayComponents/Simulation/Simulation';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { faBookOpen, faCog, faPlayCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../Components/DashboardComponents/IconButton/IconButton';
import Cmd from '../../Components/PlayComponents/Cmd/Cmd';
import SimulationLevelExecutor from './SimulationLevelExecutor';
import useCmd from '../../state/hooks/useCmd';
import { Professor } from '../../Models/User';

const StyledDiv = styled(FillContainer)`
  overflow-y: hidden;

  .row {
    padding: 0;
    margin: 0;
  }
`

const Level = (props: LevelProps) => {
  const alert = useAlert();
  const history = useHistory();
  const { user } = useContext(UserContext);

  const [level, setLevel] = useState<any>();  
  const [executor, setExecutor] = useState<SimulationLevelExecutor>();

  const playButton = useRef<HTMLButtonElement>(null);

  const [cmdRef, cmd] = useCmd();

  const lineInterfaceContentChanges = (content: any) => {
    if(executor) executor.lineInterfaceContent = content;
  }

  useEffect(() => {
    if(cmd && executor) executor.cmd = cmd;
  }, [cmd, executor]);

  useEffect(() => {
    const loadLevel = async () => {
      try {
        setLevel((await axios.get(`/playground/levels/${props.match.params.levelId}`)).data)
      } catch (err) {
        alert.error('Niveau introuvable');
        //history.push('/');
      }
    }
    loadLevel();
  }, [props.match.params.levelId, alert, history]);

  useEffect(() => {
    if(!playButton.current) return;
    setExecutor(new SimulationLevelExecutor(undefined, "alllo", playButton.current));
  }, []);

  return (
      <StyledDiv>
        <Row style={{height: '100%'}}>
          <Col md={6} style={{ resize: 'both', padding: '0', display: 'flex', flexFlow: 'column', }}>
            <div style={{ flex: '0 1 70px', backgroundColor: '#013677', border: 'none' }}>
              <IconButton icon={faBookOpen} size="2x" />
              <IconButton icon={faQuestionCircle} size="2x" />
              {(user instanceof Professor && user === level?.creator) ? (
                <>
                  <input type="text" id="input-level-name" value={level?.name} style={{ marginLeft: '5px' }} />
                  <div id="status-modify-div" style={{display: "inline"}}>
                    <label style={{ color: 'white' }}>Niveau sauvegardé ✔</label>
                    <IconButton icon={faCog} size="2x" />
                  </div>
                </>
              ) : (
                <label id="label-level-name" style={{ color: 'white', marginLeft: '5px' }}>{level ? level.name : "Sans nom"}</label>
              )}
              <IconButton icon={faPlayCircle} size="2x" ref={playButton} />
            </div>

            <LineInterface handleChange={lineInterfaceContentChanges} />

          </Col>

          <Col md={6} style={{ resize: 'both', padding: '0' }}>
            <Row id="simulation-row" style={{ height: '60%' }}>
              {executor && <Simulation init={(s) => executor.init(s)} />}
            </Row>
            <Row style={{ height: '40%' }}>
                <Cmd ref={cmdRef}></Cmd>
            </Row>
          </Col>
        </Row>
      </StyledDiv>
  )
}

export default Level;


/*

<div id='main-div' className="container-fluid" style="position: relative; max-width: 100%;">
    <div className="row h-100">
        <div className="col-6" style="resize: both; padding:0; display: flex; flex-flow: column;">
            <div style="flex: 0 1 70px; background-color: #013677; border: none;">
                <div id="go-back-button" className="btn btn-primary"
                    onclick="window.location=`{% url 'home:switch_to_bloc_interface' levelId=level.id %}`">
                    Programmation en blocs
                </div>
                <button type="button" id="btn-book" className="btn" data-toggle="modal" data-target="#modal">
                    <i className="fas fa-book-open fa-2x" style="color: white;"></i>
                </button>
                <button type="button" id="btn-hint" className="btn" data-toggle="modal" data-target="#modal-hint">
                    <i className="fas fa-question-circle fa-2x" style="color: white;"></i>
                </button>
                {% if creator %}
                <input type="text" id="input-level-name" value="{{ level.name }}" style="margin-left: 5px;">
                <div id="status-modify-div" className="btn">
                    <label id="saving-status" style="color:white">Niveau sauvegardé ✔</label>
                    <button type="button" id="btn-modify" ­­ className="btn btn-primary" data-toggle="modal"
                        data-target="#edit-modal">
                        <i className="fas fa-cog fa-2x"></i>
                    </button>
                </div>
                {% else %}
                <label id="label-level-name" style="color:white; margin-left: 5px;">{{level.name}}</label>
                {% endif %}
            </div>


            {% include "modules/line_interface.html" %}


        </div>
        <div className="col-6" style="resize: both">
            <div className="row" id="simulation-row" style="height:60%;">
                {% include "modules/simulation.html" %}
            </div>
            <div className="row" style="height:40%">
                <div style="padding: 0;" className="col">
                    {% include "modules/cmd.html" %}
                </div>
            </div>
        </div>
    </div>
</div>

*/