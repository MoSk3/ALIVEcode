import "dotenv/config";
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'reflect-metadata';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import axios from 'axios';
import AlertTemplate from 'react-alert-template-basic';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpAPI from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import LoadingScreen from './Components/UtilsComponents/LoadingScreen/LoadingScreen';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;
axios.defaults.headers = {
	'Content-Type': 'application/json',
	accept: 'application/json',
};

// React Alert Configs
const alertOptions = {
	position: positions.BOTTOM_RIGHT,
	timeout: 7000,
	offset: '30px',
	transition: transitions.FADE,
};

i18next
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(LanguageDetector)
	.use(HttpAPI)
	.init({
		supportedLngs: ['en', 'fr'],
		fallbackLng: 'fr',
		detection: {
			order: [
				'querystring',
				'path',
				'cookie',
				'localStorage',
				'sessionStorage',
				'navigator',
				'htmlTag',
				'subdomain',
			],
			caches: ['cookie'],
		},
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
		},
		defaultNS: 'translation',
	});

ReactDOM.render(
	<Suspense fallback={<LoadingScreen />}>
		<React.StrictMode>
			<AlertProvider template={AlertTemplate} {...alertOptions}>
				<App />
			</AlertProvider>
		</React.StrictMode>
	</Suspense>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
process.env.DEBUG ? reportWebVitals(console.log) : reportWebVitals();
