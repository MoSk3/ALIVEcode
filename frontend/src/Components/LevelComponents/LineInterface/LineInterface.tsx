import { LineInterfaceProps, StyledLineInterface } from './lineInterfaceTypes';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-alive';
import './mode-alivescript';

const LineInterface = ({ handleChange }: LineInterfaceProps) => {
	return (
		<StyledLineInterface>
			<AceEditor
				className="relative w-100 h-100"
				style={{
					fontSize: 'large',
				}}
				enableSnippets
				enableBasicAutocompletion
				enableLiveAutocompletion
				mode="alivescript"
				theme="alive"
				onChange={handleChange}
				fontSize="large"
				name="1nt3rf4c3" //"UNIQUE_ID_OF_DIV"
				editorProps={{ $blockScrolling: true }}
			/>
		</StyledLineInterface>
	);
};

export default LineInterface;