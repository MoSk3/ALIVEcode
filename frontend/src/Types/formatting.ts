import { TFunction } from "i18next";

export const prettyField = (field: string) => {
	return field
		.split(' ')
		.map(t => t.substring(0, 1).toUpperCase() + t.substring(1))
		.join(' ');
};

export const formatDate = (date: Date, t: TFunction) => {
	const monthsList = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const daysList = [
		'Dimanche',
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Samedi',
	];

	const year = date.getFullYear();
	const month = date.getMonth();
	const dayOfWeek = date.getDay();
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();

	return `${daysList[dayOfWeek]}, ${day} ${
		monthsList[month]
	} ${year} - ${hour}:${minute <= 9 ? `0${minute}` : minute}`;
};