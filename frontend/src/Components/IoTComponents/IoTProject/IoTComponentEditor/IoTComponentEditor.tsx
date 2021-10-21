import { Col, Form, Row } from 'react-bootstrap';
import { iotComponentEditorProps } from './iotComponentEditorTypes';
import { IoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import IoTGenericComponent from '../../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import { IoTButton } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTButton';
import { IoTLogs } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import Button from '../../../UtilsComponents/Button/Button';
import Link from '../../../UtilsComponents/Link/Link';
import DateTime from 'react-datetime';
import moment from 'moment';

const IoTComponentEditor = ({ component }: iotComponentEditorProps) => {
	const renderComponentSpecificFields = () => {
		if (component instanceof IoTProgressBar)
			return (
				<>
					<Form.Label>Value</Form.Label>
					<Form.Control
						type="range"
						min={component.getMin()}
						max={component.getMax()}
						value={component.value}
						className="mb-2"
						onChange={(e: any) => component.setValue(e.target.value)}
					/>
					<Form.Label>Minimum</Form.Label>
					<Form.Control
						defaultValue={component.getMin()}
						type="number"
						className="mb-2"
						onChange={(e: any) =>
							component.setRange(e.target.value, component.getMax())
						}
					/>
					<Form.Label>Maximum</Form.Label>
					<Form.Control
						defaultValue={component.getMax()}
						type="number"
						className="mb-2"
						onChange={(e: any) =>
							component.setRange(component.getMin(), e.target.value)
						}
					/>
					<Form.Label>Is percentage</Form.Label>
					<Form.Check
						defaultChecked={component.isPercentage}
						type="checkbox"
						className="mb-2"
						onChange={(e: any) => {
							component.setIsPercentage(e.target.checked);
						}}
					/>
				</>
			);
		if (component instanceof IoTButton)
			return (
				<>
					<Form.Label>Value</Form.Label>
					<Form.Control
						defaultValue={component.value}
						className="mb-2"
						onChange={(e: any) => component.setValue(e.target.value)}
					/>
				</>
			);
		if (component instanceof IoTLogs)
			return (
				<>
					<Form.Label>Logs</Form.Label>
					{component.value.length === 0 && (
						<>
							<br />
							<div className="mb-5">
								No Logs,{' '}
								<Link onClick={() => component.addLog('New log')} dark>
									add one?
								</Link>
							</div>
						</>
					)}
					{component.value.map(log => (
						<Row>
							<Col>
								<Form.Control
									as="textarea"
									className="mb-2"
									defaultValue={log.text}
									onChange={(e: any) =>
										component.updateLog(log, { ...log, text: e.target.value })
									}
								/>
							</Col>
							<Col>
								<DateTime
									onChange={date => {
										if (moment.isMoment(date)) {
											component.updateLog(log, {
												...log,
												date: (date as moment.Moment).toDate(),
											});
										}
									}}
									className="date"
									initialValue={log.date}
								></DateTime>
							</Col>
						</Row>
					))}
					{component.value.length > 0 && (
						<>
							<Link onClick={() => component.addLog('New log')} dark>
								Add log
							</Link>
							<br />
							<Button
								className="mt-2"
								onClick={() => component.clearLogs()}
								variant="danger"
							>
								Clear logs
							</Button>
						</>
					)}
				</>
			);
	};

	return (
		<div>
			<Form.Label>Name</Form.Label>
			<Form.Control
				defaultValue={component.name}
				className="mb-2"
				onChange={(e: any) => component.setName(e.target.value)}
			/>
			<Form.Label>Id</Form.Label>
			<Form.Control
				defaultValue={component.id}
				className="mb-2"
				onChange={(e: any) => component.setId(e.target.value)}
			/>
			{renderComponentSpecificFields()}
			<IoTGenericComponent component={component}></IoTGenericComponent>
		</div>
	);
};

export default IoTComponentEditor;