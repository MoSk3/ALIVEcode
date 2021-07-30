import FillContainer from '../../Components/MiscComponents/FillContainer/FillContainer';
import { ChallengeProps } from './challengeTypes';
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
import ChallengeExecutor from './ChallengeExecutorNew';

const StyledDiv = styled(FillContainer)`
  overflow-y: hidden;

  .row {
    padding: 0;
    margin: 0;
  }
`

const Challenge = (props: ChallengeProps) => {
  const alert = useAlert();
  const history = useHistory();

  const [challenge, setChallenge] = useState<any>();

  const playButton = useRef<HTMLButtonElement>(null);
  
  const [executor, setExecutor] = useState<ChallengeExecutor>();

  const lineInterfaceContentChanges = (content: any) => {
    if(executor) executor.lineInterfaceContent = content;
  }

  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setChallenge((await axios.get(`/playground/challenges/${props.match.params.challengeId}`)).data)
      } catch (err) {
        alert.error('Niveau introuvable');
        //history.push('/');
      }
    }
    loadChallenge();
  }, [props.match.params.challengeId, alert, history]);

  useEffect(() => {
    if(!playButton.current) return;
    setExecutor(new ChallengeExecutor(undefined, "alllo", playButton.current));
  }, []);

  return (
      <StyledDiv>
        <Row style={{height: '100%'}}>
          <Col md={6} style={{ resize: 'both', padding: '0', display: 'flex', flexFlow: 'column', }}>
            <div style={{ flex: '0 1 70px', backgroundColor: '#013677', border: 'none' }}>
              <IconButton icon={faBookOpen} size="2x" />
              <IconButton icon={faQuestionCircle} size="2x" />
              {(user?.professor && user?.professor === challenge?.creator) ? (
                <>
                  <input type="text" id="input-challenge-name" value={challenge?.name} style={{ marginLeft: '5px' }} />
                  <div id="status-modify-div" style={{display: "inline"}}>
                    <label style={{ color: 'white' }}>Niveau sauvegardé ✔</label>
                    <IconButton icon={faCog} size="2x" />
                  </div>
                </>
              ) : (
                <label id="label-challenge-name" style={{ color: 'white', marginLeft: '5px' }}>{challenge ? challenge.name : "Sans nom"}</label>
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
                <Cmd></Cmd>
            </Row>
          </Col>
        </Row>
      </StyledDiv>
  )
}

export default Challenge;


/*

<div id='main-div' className="container-fluid" style="position: relative; max-width: 100%;">
    <div className="row h-100">
        <div className="col-6" style="resize: both; padding:0; display: flex; flex-flow: column;">
            <div style="flex: 0 1 70px; background-color: #013677; border: none;">
                <div id="go-back-button" className="btn btn-primary"
                    onclick="window.location=`{% url 'home:switch_to_bloc_interface' challengeId=challenge.id %}`">
                    Programmation en blocs
                </div>
                <button type="button" id="btn-book" className="btn" data-toggle="modal" data-target="#modal">
                    <i className="fas fa-book-open fa-2x" style="color: white;"></i>
                </button>
                <button type="button" id="btn-hint" className="btn" data-toggle="modal" data-target="#modal-hint">
                    <i className="fas fa-question-circle fa-2x" style="color: white;"></i>
                </button>
                {% if creator %}
                <input type="text" id="input-challenge-name" value="{{ challenge.name }}" style="margin-left: 5px;">
                <div id="status-modify-div" className="btn">
                    <label id="saving-status" style="color:white">Niveau sauvegardé ✔</label>
                    <button type="button" id="btn-modify" ­­ className="btn btn-primary" data-toggle="modal"
                        data-target="#edit-modal">
                        <i className="fas fa-cog fa-2x"></i>
                    </button>
                </div>
                {% else %}
                <label id="label-challenge-name" style="color:white; margin-left: 5px;">{{challenge.name}}</label>
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