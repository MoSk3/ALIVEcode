import { IoTProject, IoTProjectLayout } from '../../../Models/Iot/IoTproject.entity';
import { useState, useEffect, useMemo } from 'react';
import { IoTSocket } from '../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { plainToClass } from 'class-transformer';
import { IoTComponent } from '../../../Models/Iot/IoTProjectClasses/IoTComponent';
import { IOT_COMPONENT_TYPE } from '../../../Models/Iot/IoTProjectClasses/IoTComponent';
import IoTButtonComponent from '../IoTProjectComponents/IoTButtonComponent';
import { Row, Col } from 'react-bootstrap';
import IoTProgressBarComponent from '../IoTProjectComponents/IoTProgressBarComponent';

const IoTProjectBody = ({ project }: { project: IoTProject }) => {
	const [components, setComponents] = useState<IoTProjectLayout>([]);
	const socket = useMemo(
		() =>
			new IoTSocket(
				plainToClass(IoTProject, {
					...project,
					layout: [
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
						},
					],
				}),
				layout => {
					setComponents([...layout]);
				},
			),
		[project],
	);

	useEffect(() => {
		socket.onReceiveUpdate({ id: 'button', value: 'heyyyy' });
		socket.onReceiveUpdate({ id: 'progress', value: 10 });

		setTimeout(() => {
			socket.onReceiveUpdate({ id: 'button2', value: 'also hey' });
			socket.onReceiveUpdate({ id: 'progress', value: 80 });
		}, 1000);

		return () => {
			socket.closeSocket();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderComponent = (component: IoTComponent) => {
		switch (component.type) {
			case IOT_COMPONENT_TYPE.BUTTON:
				return <IoTButtonComponent component={component} />;
			case IOT_COMPONENT_TYPE.PROGRESS_BAR:
				return <IoTProgressBarComponent component={component} />;
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