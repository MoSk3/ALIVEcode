import { AsScript as AsScriptModel } from "../../../Models/AsScript/as-script.entity";
import LineInterface from '../../LevelComponents/LineInterface/LineInterface';
import { Col, Row } from 'react-bootstrap';
import { useState, useRef, MutableRefObject } from 'react';
import api from '../../../Models/api';

export const AsScript = ({ asScript }: { asScript: AsScriptModel }) => {
	const [saving, setSaving] = useState(false);
	const content = useRef<string>(asScript.content);
	const saveTimeout = useRef<any>(null);

	const handleChange = async (newContent: string) => {
		setSaving(true);
		content.current = newContent;
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(save, 2000);
	};

	const save = async () => {
		await api.db.asScript.updateContent(asScript, content.current);
		setSaving(false);
	};

	return (
		<>
			<div style={{ height: '500px' }}>
				<Row className="h-100">
					<Col style={{ padding: '0' }}>
						<LineInterface
							handleChange={handleChange}
							initialContent={asScript.content}
						/>
					</Col>
				</Row>
			</div>
			{saving && 'Saving...'}
		</>
	);
};

export default AsScript;