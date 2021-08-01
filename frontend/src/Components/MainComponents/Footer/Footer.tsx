import { FooterProps } from './footerTypes';
import './footer.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = (props: FooterProps) => {

	const { t } = useTranslation();

	return (
		<footer className="site-footer">
			<div className="container">
				<div className="row">
					<div className="col-sm-12 col-md-6">
						<h6>{t('home.footer.about.title')}</h6>
						<p className="text-justify">
							{t('home.footer.about.description')}
						</p>
					</div>

					<div className="col-xs-6 col-md-3">
						<h6>{t('home.footer.categories')}</h6>
						<ul className="footer-links">
							<li><Link to="/dashboard">{t('msg.section.dashboard')}</Link></li>
							<li><Link to="/mind">{t('msg.section.amc')}</Link></li>
							<li><Link to="/about">{t('msg.section.about')}</Link></li>
						</ul>
					</div>

					<div className="col-xs-6 col-md-3">
						<h6>{t('home.footer.links')}</h6>
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
						{/* TODO: copyright logo*/}
						<p className="copyright-text">{t('home.footer.copyright')}
							<a href="https://lrima.cmaisonneuve.qc.ca/" rel="noopener noreferrer" target="_blank"> LRIMA</a>.
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer;