import Form from "../../../UtilsComponents/Form/Form";
import {
	IoTObject,
	IOTOBJECT_LABEL,
} from '../../../../Models/Iot/IoTobject.entity';
import { plainToClass } from 'class-transformer';
import Link from '../../../UtilsComponents/Link/Link';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';
import { IoTObjectSettingsProps } from './iotObjectSettingsTypes';

const IoTObjectSettings = ({ object, onUpdate }: IoTObjectSettingsProps) => {
	return (
		<>
			<Form
				onSubmit={res => {
					const { name, description, label } = res.data;
					object.name = name;
					object.description = description;
					object.label = label;
					onUpdate(object);
				}}
				action={FORM_ACTION.PATCH}
				name="iot object"
				url={`iot/objects/${object.id}`}
				inputGroups={[
					{
						name: 'name',
						required: true,
						default: object.name,
						inputType: 'text',
					},
					{
						name: 'description',
						required: false,
						default: object.description,
						inputType: 'text',
					},
					{
						name: 'label',
						required: true,
						default: object.label,
						inputType: 'select',
						selectOptions: IOTOBJECT_LABEL,
					},
				]}
			/>
			<br />
			&nbsp;
			<Link onClick={() => navigator.clipboard.writeText(object.id)} dark bold>
				Copy id
			</Link>
		</>
	);
};

export default IoTObjectSettings;