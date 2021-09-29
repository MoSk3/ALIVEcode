import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import { useState, useEffect, useMemo } from 'react';
import { IoTSocket } from '../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { classToPlain } from 'class-transformer';
import { IoTComponent } from '../../../Models/Iot/IoTProjectClasses/IoTComponent';
import { IOT_COMPONENT_TYPE } from '../../../Models/Iot/IoTProjectClasses/IoTComponent';
import IoTButtonComponent from '../IoTProjectComponents/IoTButtonComponent';
import { Row, Col } from 'react-bootstrap';
import IoTProgressBarComponent from '../IoTProjectComponents/IoTProgressBarComponent';
import { IoTProgressBar } from '../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import IoTLogsComponent from '../IoTProjectComponents/IoTLogsComponent';
import { IoTLogs } from '../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import api from '../../../Models/api';

const IoTProjectBody = ({ project }: { project: IoTProject }) => {
	const [components, setComponents] = useState<Array<IoTComponent>>([]);
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
							},
							{
								id: 'button2',
								type: IOT_COMPONENT_TYPE.BUTTON,
							},
							{
								id: 'progress',
								type: IOT_COMPONENT_TYPE.PROGRESS_BAR,
								min: 100,
								max: 1000,
							},
							{
								id: 'logs',
								type: IOT_COMPONENT_TYPE.LOGS,
							},
						],
					},
				}),*/
				layout => {
					setComponents([...layout.components]);
				},
			),
		[project],
	);

	const saveComponents = async (components: Array<IoTComponent>) => {
		project.layout.components = components;
		const plainProject = classToPlain(project);
		console.log(plainProject.layout);
		await api.db.iot.projects.updateLayout(project.id, plainProject.layout);
	};

	useEffect(() => {
		socket.onReceiveUpdate({ id: 'button', value: 'heyyyy' });

		setTimeout(() => {
			socket.onReceiveUpdate({ id: 'button2', value: 'nope' });
			const manager = socket.getComponentManager();
			if (manager) saveComponents(manager.getComponents());
		}, 1000);

		const interval = setInterval(() => {
			socket.onReceiveUpdate({
				id: 'progress',
				value: Math.floor(Math.random() * 900 + 100),
			});
		}, 100);

		return () => {
			clearInterval(interval);
			socket.closeSocket();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderComponent = (component: IoTComponent) => {
		switch (component.type) {
			case IOT_COMPONENT_TYPE.BUTTON:
				return <IoTButtonComponent component={component} />;
			case IOT_COMPONENT_TYPE.PROGRESS_BAR:
				return (
					<IoTProgressBarComponent component={component as IoTProgressBar} />
				);
			case IOT_COMPONENT_TYPE.LOGS:
				return <IoTLogsComponent component={component as IoTLogs} />;
		}
	};

	return (
		<Row>
			{components.map((c: IoTComponent, idx) => (
				<Col key={idx}>{renderComponent(c)}</Col>
			))}
		</Row>
	);
};

export default IoTProjectBody;