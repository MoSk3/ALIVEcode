import { HomeProps } from './homeTypes';
import Footer from '../../Components/MainComponents/Footer/Footer';

import './home.css';
import { useHistory } from 'react-router';

const Home = (props: HomeProps) => {

    const history = useHistory();

    return (
        <>
            <div className="header">
                <h1>A.L.I.V.E.</h1>
                <p id="typer" style={{display: 'inline', minHeight: '40px', minWidth: '1px'}}></p>
                <label id="cursor">|</label>

                <div id="arrow">
                    <svg onClick={() => history.push('/dashboard')} data-name="arrow" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <g data-name="Arrow Left">
                            <path style={{fill: "white"}}
                                d="M7.77,23.58l-2.24-2a0.5,0.5,0,0,1,0-.71L13.43,12,5.5,3.13a0.5,0.5,0,0,1,0-.71l2.24-2a0.5,0.5,0,0,1,.71,0L18.8,12,8.48,23.54A0.5,0.5,0,0,1,7.77,23.58Z" />
                        </g>
                    </svg>
                </div>
            </div>

            <div className="container">
                <div id="myBody" className="container-fluid">
                    <div className="card mb-3 w-100" onClick={() => history.push('/playground')}>
                        <div className="row no-gutters">
                            <div className="col-md-4">
                                <img src='Assets/images/Voiture.gif' className="card-img" alt="..."></img>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h4 className="card-title">ALIVE PLAY</h4>
                                    <p className="card-text">Dans cette section, vous pourrez créer vos propres niveaux ou jouer les
                                        niveaux des autres utilisateurs!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3 w-100" onClick={() => history.push('/mind')}>
                        <div className="row no-gutters">
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h4 className="card-title">ALIVE Mind Controller</h4>
                                    <p className="card-text">Dans cette activité, vous auriez la possibilité de controller une voiture à
                                        l'aide de votre pensée!</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <img src="Assets/images/cloud.png" className="card-img" alt="..."></img>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3 w-100" onClick={() => {}}>
                        <div className="row no-gutters">
                            <div className="col-md-4">
                                <img src="Assets/images/Labyrinthe.jpg" className="card-img" alt="..."></img>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h4 className="card-title">Augmented Vehicle Perception</h4>
                                    <p className="card-text">En construction.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3 w-100" onClick={() => {
                        window.open('https://lrima.cmaisonneuve.qc.ca/', '_blank');
                    }}>
                        <div className="row no-gutters">
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h4 className="card-title">Le laboratoire de recherche LRIMA</h4>
                                    <p className="card-text">Site officiel du laboratoire de recherche informatique de Maisonneuve
                                        LRIMA.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <img src="Assets/images/LRIMA.png" className="card-img" alt="..."></img>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
};

export default Home;