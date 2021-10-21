import { IoTProject, IoTProjectLayout } from '../../../Models/Iot/IoTproject.entity';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { IoTSocket } from '../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { classToPlain } from 'class-transformer';
import { IoTComponent } from '../../../Models/Iot/IoTProjectClasses/IoTComponent';
import { Row, Container } from 'react-bootstrap';
import api from '../../../Models/api';
import { StyledIoTProjectBody } from './iotProjectBodyTypes';
import IoTGenericComponent from '../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import Modal from '../../UtilsComponents/Modal/Modal';
import IoTComponentEditor from './IoTComponentEditor/IoTComponentEditor';

const IoTProjectBody = ({ project }: { project: IoTProject }) => {
	const [components, setComponents] = useState<Array<IoTComponent>>([]);
	const [lastSaved, setLastSaved] = useState<number>(Date.now() - 4000);
	const [editingComponent, setEditingComponent] = useState<IoTComponent>();
	const saveTimeout = useRef<any>(null);

	const saveComponents = useCallback(
		async (components: Array<IoTComponent>) => {
			setLastSaved(Date.now());
			project.layout.components = components;
			const plainProject = classToPlain(project);
			await api.db.iot.projects.updateLayout(project.id, plainProject.layout);
		},
		[project],
	);

	const saveComponentsTimed = useCallback(
		async (components: Array<IoTComponent>) => {
			if (Date.now() - lastSaved < 2000) {
				saveTimeout.current && clearTimeout(saveTimeout.current);
				saveTimeout.current = setTimeout(
					() => saveComponents(components),
					2000,
				);
				return;
			}

			saveComponents(components);
		},
		[lastSaved, saveComponents],
	);

	const onLayoutChange = useCallback(
		(layout: IoTProjectLayout) => {
			setComponents([...layout.components]);
			saveComponentsTimed(layout.components);
		},
		[saveComponentsTimed],
	);

	const socket = useMemo(
		() =>
			new IoTSocket(
				project,
				/*plainToClass(IoTProject, {
					...project,
					layout: {
						components: [
							{
								id: 'button',
								type: IOT_COMPONENT_TYPE.BUTTON,
								value: 'CLICK ME',
							},
							{
								id: 'button2',
								type: IOT_COMPONENT_TYPE.BUTTON,
								value: 'LOOOL',
							},
							{
								id: 'progress',
								type: IOT_COMPONENT_TYPE.PROGRESS_BAR,
								min: 100,
								max: 1000,
								value: 50,
							},
							{
								id: 'logs',
								type: IOT_COMPONENT_TYPE.LOGS,
								value: [],
							},
							{
								id: 'button3',
								type: IOT_COMPONENT_TYPE.BUTTON,
								value: 'CLICK ME',
							},
							{
								id: 'logs3',
								type: IOT_COMPONENT_TYPE.LOGS,
								value: [],
							},
							{
								id: 'button4',
								type: IOT_COMPONENT_TYPE.BUTTON,
								value: 'CLICK ME',
							},
							{
								id: 'progress2',
								type: IOT_COMPONENT_TYPE.BUTTON,
								value: 80,
								min: 0,
								max: 100,
							},
							{
								id: 'logs4',
								type: IOT_COMPONENT_TYPE.LOGS,
								value: [],
							},
						],
					},
				}),*/
				onLayoutChange,
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	useEffect(() => {
		socket.setOnRender(onLayoutChange);
	}, [socket, onLayoutChange]);

	const getComponentsMatrix = (): Array<Array<IoTComponent>> => {
		const componentsMatrix = [];
		for (let i = 0; i < Math.ceil(components.length / 3); i++) {
			const row = components.slice(i * 3, i * 3 + 3);
			componentsMatrix.push(row);
		}
		return componentsMatrix;
	};

	return (
		<StyledIoTProjectBody>
			<Container fluid>
				{getComponentsMatrix().map((row, idx) => (
					<Row className="w-100" key={idx}>
						{row.map((c, idx2) => (
							<IoTGenericComponent
								key={idx2}
								setEditingComponent={setEditingComponent}
								component={c}
							/>
						))}
					</Row>
				))}
			</Container>
			<Modal
				size="lg"
				title="Edit component"
				open={editingComponent ? true : false}
				onClose={() => setEditingComponent(undefined)}
			>
				{editingComponent && (
					<IoTComponentEditor component={editingComponent}></IoTComponentEditor>
				)}
			</Modal>
		</StyledIoTProjectBody>
	);
};

export default IoTProjectBody;