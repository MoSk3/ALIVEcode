import { createContext } from 'react';

export type Theme = {
	color: {
		primary: string;
		primary_rgb: string;
		secondary: string;
		secondary_rgb: string;
		third: string;
		third_rgb: string;
		fourth: string;
		fourth_rgb: string;
		pale: string;
		pale_rgb: string;
		contrast: string;
		constrast_rgb: string;
		hover: string;
		background: string;
		background_rgb: string;
		foreground: string;
		foreground_rgb: string;
	};
	background: string;
	name: string;
};

export const themes: { light: Theme; dark: Theme } = {
	light: {
		color: {
			primary: '#0177bc',
			primary_rgb: '1,119,188',
			secondary: '#3F9CF3',
			secondary_rgb: '63,156,243',
			third: '#04e6d3',
			third_rgb: '0,186,198',
			fourth: '#029FCA',
			fourth_rgb: '2,159,202',
			pale: '#D9F3FF',
			pale_rgb: '217,243,255',
			contrast: '#ffb013',
			constrast_rgb: '255,176,19',
			hover: '#00cbe6',
			background: '#ffffff',
			background_rgb: '255,255,255',
			foreground: 'black',
			foreground_rgb: '0,0,0',
		},
		background: '#ffffff',
		name: 'light',
	},
	dark: {
		color: {
			primary: '#082032',
			primary_rgb: '1,119,188',
			secondary: '#2C394B',
			secondary_rgb: '63,156,243',
			third: '#334756',
			third_rgb: '0,186,198',
			fourth: '#029FCA',
			fourth_rgb: '2,159,202',
			pale: '#D9F3FF',
			pale_rgb: '217,243,255',
			contrast: '#FF4C29',
			constrast_rgb: '255,176,19',
			hover: '#00cbe6',
			background: '#222222',
			background_rgb: '34,34,34',
			foreground: '#f0f6fc',
			foreground_rgb: '240,246,252',
		},
		background: '#222222',
		name: 'dark',
	},
};

export const ThemeContext = createContext<{
	theme: Theme;
	setTheme: (theme: Theme) => void;
}>({ theme: themes.light, setTheme: () => {} });
