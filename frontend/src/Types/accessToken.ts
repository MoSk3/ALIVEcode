import axios from "axios";

let accessToken: string;
export const setAccessToken = (value: string) => {
	accessToken = value;
	axios.defaults.headers['Authorization'] = 'JWT ' + accessToken;
};

export const getAccessToken = () => {
	return accessToken;
};