import { Form } from 'react-bootstrap';
import { AsScript as AsScriptModel } from '../../../../Models/AsScript/as-script.entity';
import AsScript from '../../../AliveScriptComponents/AsScript/AsScript';
import Button from '../../../UtilsComponents/Button/Button';
import { IoTRouteSettingsProps } from './iotRouteSettingsTypes';
import api from '../../../../Models/api';
import { useContext } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import LoadingScreen from '../../../UtilsComponents/LoadingScreen/LoadingScreen';

const IoTRouteSettings = ({ route }: IoTRouteSettingsProps) => {
	const { asScript: script } = route;
	const { project, updateScript } = useContext(IoTProjectContext);

	if (!project) return <LoadingScreen />;

	return (
		<div>
			<Form.Label>Name</Form.Label>
			<Form.Control defaultValue={route.name} className="mb-2" />
			<Form.Label>Path</Form.Label>
			<Form.Control defaultValue={route.path} className="mb-2" />
			<hr />
			<Form.Label style={{ display: 'block' }} className="mt-2">
				Execution Script
			</Form.Label>
			{script ? (
				<AsScript
					onSave={(asScript: AsScriptModel) => {
						updateScript(route, asScript);
					}}
					asScript={script}
				></AsScript>
			) : (
				<Button
					variant="primary"
					onClick={async () => {
						const asScript = new AsScriptModel();
						asScript.content = '# New Script';
						asScript.name = `Script for route ${route.name}`;
						const script = await api.db.iot.projects.createScriptRoute(
							project.id,
							route.id,
							asScript,
						);
						updateScript(route, script);
					}}
				>
					New script
				</Button>
			)}
		</div>
	);
};

export default IoTRouteSettings;