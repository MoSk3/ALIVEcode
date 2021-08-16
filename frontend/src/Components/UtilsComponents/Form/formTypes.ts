import { AxiosResponse } from "axios";

export type FormProps = {
	name: string;
	url: string;
	action: 'POST' | 'UPDATE' | 'DELETE';
	onSubmit?: (response: AxiosResponse<any>) => void;
	inputGroups: Array<{
		required: boolean;
		minLength?: number;
		maxLength?: number;
		name: string;
		inputType: 'text' | 'number' | 'textarea' | 'checkbox';
	}>;
};
