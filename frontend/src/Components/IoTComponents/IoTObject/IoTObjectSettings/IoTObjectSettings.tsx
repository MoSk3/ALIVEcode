import Form from "../../../UtilsComponents/Form/Form";
import {
	IoTObject,
	IOTOBJECT_LABEL,
} from '../../../../Models/Iot/IoTobject.entity';
import { plainToClass } from 'class-transformer';
import Link from '../../../UtilsComponents/Link/Link';

const IoTObjectSettings = ({ object }: { object: IoTObject }) => {
	return (
		<>
			<Form
				onSubmit={res => {
					object = plainToClass(IoTObject, res.data);
				}}
				action="PATCH"
				name="iot_project"
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
						name: 'interactRights',
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