import { AsScript as AsScriptModel } from "../../../Models/AsScript/as-script.entity";
import LineInterface from '../../LevelComponents/LineInterface/LineInterface';

export const AsScript = ({ asScript }: { asScript: AsScriptModel }) => {
	const handleChange = async (content: string) => {
		console.log(content);
	};

	return (
		<>
			<LineInterface
				handleChange={handleChange}
				initialContent={asScript.content}
			/>
		</>
	);
};

export default AsScript;