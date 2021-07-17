import { LineInterfaceProps } from './lineInterfaceTypes';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const LineInterface = (props: LineInterfaceProps) => {

	const onChange = (newValue: any) => {
		console.log("change", newValue);
	}

	return (
		<AceEditor
			mode="javascript"
			theme="monokai"
			onChange={onChange}
			name="UNIQUE_ID_OF_DIV"
			editorProps={{ $blockScrolling: true }}
		/>
	)
}

export default LineInterface;