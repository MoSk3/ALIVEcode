import { AxiosResponse } from "axios";

export type FormProps = {
	name: string;
	url: string;
	action: 'POST' | 'UPDATE' | 'DELETE';
	onSubmit?: (response: AxiosResponse<any>) => void;
	inputGroups: Array<InputGroup>;
};

export type InputGroup = {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	default?: any;
	name: string;
	selectOptions?: Array<any> | { [key: string]: any };
	inputType:
		| 'checkbox'
		| 'color'
		| 'date'
		| 'select'
		| 'textarea'
		| 'datetime-local'
		| 'email'
		| 'file'
		| 'hidden'
		| 'image'
		| 'month'
		| 'number'
		| 'password'
		| 'radio'
		| 'range'
		| 'tel'
		| 'text'
		| 'time'
		| 'url'
		| 'week';
};