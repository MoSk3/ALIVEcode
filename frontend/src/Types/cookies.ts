import { Theme, themes } from '../state/contexts/ThemeContext';

export const getCookie = (name: string) =>
	document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';

export const setCookie = (name: string, value: string, days: number) => {
	var expires = '';
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

export const loadThemeFromCookies = (): Theme | undefined => {
	const themeCookie = getCookie('theme');
	if (themeCookie)
		return Object.values(themes).find(t => t.name === themeCookie);
};