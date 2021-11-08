import { useState } from 'react';
import Modal from '../../../UtilsComponents/Modal/Modal';
import IoTObjectSettings from '../IoTObjectSettings/IoTObjectSettings';
import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import Card from '../../../UtilsComponents/Cards/Card/Card';
import IoTIcon from '../../../../assets/images/icons/iot-icon.png';

const IoTObjectLargeCard = ({ object }: { object: IoTObject }) => {
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<>
			<Card
				title={object.name}
				onClick={() => setSettingsOpen(true)}
				img={IoTIcon}
			/>
			<Modal
				title="Object settings"
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
			>
				<IoTObjectSettings object={object}></IoTObjectSettings>
			</Modal>
		</>
	);
};

export default IoTObjectLargeCard;