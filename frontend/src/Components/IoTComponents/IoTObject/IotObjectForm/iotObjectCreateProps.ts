import { AxiosResponse } from 'axios';

export type IoTObjectCreateProps = {
	onSubmit?: (res: AxiosResponse<any>) => void;
};