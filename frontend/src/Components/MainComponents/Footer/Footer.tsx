import { FooterProps } from './footerTypes';
import './footer.css';
import { Link } from 'react-router-dom';

const Footer = (props: FooterProps) => {

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <h6>À propos</h6>
                        <p className="text-justify">
                            Le projet <i>ALIVE</i> vise à fournir une méthode et une pratique d'enseignement de la programmation
                            pour simplifier le concept théorique de la programmation.</p>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <h6>Catégories</h6>
                        <ul className="footer-links">
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/mind">ALIVE Mind Controller</Link></li>
                            <li><Link to="/about">À propos de nous</Link></li>
                        </ul>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <h6>Liens pratiques</h6>
                        <ul className="footer-links">
                            <li><a href="https://lrima.cmaisonneuve.qc.ca/" rel="noopener noreferrer" target="_blank">LRIMA</a></li>
                            <li><a href="https://lrima.cmaisonneuve.qc.ca/alive/" rel="noopener noreferrer" target="_blank">LRIMA ALIVE</a></li>
                        </ul>
                    </div>
                </div>
                <hr />
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <p className="copyright-text">Copyright &copy; 2021 All Rights Reserved by
                            <a href="https://lrima.cmaisonneuve.qc.ca/" rel="noopener noreferrer" target="_blank"> LRIMA</a>.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;