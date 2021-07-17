import FillContainer from '../../Components/MiscComponents/FillContainer/FillContainer';
import { ChallengeProps } from './challengeTypes';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import LineInterface from '../../Components/PlayComponents/LineInterface/LineInterface';
import { UserContext } from '../../UserContext';

const Challenge = (props: ChallengeProps) => {
  const alert = useAlert();
  const history = useHistory();
  const [challenge, setChallenge] = useState<any>();
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

  return (
    <FillContainer>
      {/* 
      <div className="row h-100">
        <div className="col-6" style={{ resize: 'both', padding: '0', display: 'flex', flexFlow: 'column', }}>
          <div style={{ flex: '0 1 70px', backgroundColor: '#013677', border: 'none' }}>
            <div id="go-back-button" className="btn btn-primary"
              onClick={() => "window.location=`{% url 'home:switch_to_bloc_interface' challengeId=challenge.id %}`"}>
              Programmation en blocs
            </div>
            <button type="button" id="btn-book" className="btn" data-toggle="modal" data-target="#modal">
              <i className="fas fa-book-open fa-2x" style={{ color: 'white' }}></i>
            </button>
            <button type="button" id="btn-hint" className="btn" data-toggle="modal" data-target="#modal-hint">
              <i className="fas fa-question-circle fa-2x" style={{ color: 'white' }}></i>
            </button>


            {user?.professor == challenge?.creator ? (
              <input type="text" id="input-challenge-name" value="{{ challenge.name }}" style={{ marginLeft: '5px' }}>
                <div id="status-modify-div" className="btn">
                  <label id="saving-status" style="color:white">Niveau sauvegardé ✔</label>
                  <button type="button" id="btn-modify" ­­ className="btn btn-primary" data-toggle="modal"
                        data-target="#edit-modal">
                  <i className="fas fa-cog fa-2x"></i>
                    </button>
                </div>
            ) : (
              <label id="label-challenge-name" style={{color: 'white', marginLeft: '5px'}}>{{ challenge.name }}</label>
            )}
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
      <LineInterface />
            */}
    </FillContainer>
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