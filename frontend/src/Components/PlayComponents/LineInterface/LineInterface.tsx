import { LineInterfaceProps } from './lineInterfaceTypes';

import AceEditor from "react-ace";

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import styled from 'styled-components';

const StyledDiv = styled.div`
	flex: 1 1 auto;
	fontsize: large;
`;

const LineInterface = ({ handleChange }: LineInterfaceProps) => {
	return (
		<StyledDiv>
			<AceEditor
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					fontSize: 'large',
				}}
				enableSnippets
				enableBasicAutocompletion
				enableLiveAutocompletion
				mode="alivescript"
				theme="monokai"
				onChange={handleChange}
				name="UNIQUE_ID_OF_DIV"
				editorProps={{ $blockScrolling: true }}
			/>
		</StyledDiv>
	);
};

export default LineInterface;