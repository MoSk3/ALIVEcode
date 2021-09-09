import { LineInterfaceProps, StyledLineInterface, EditorTabModel } from './lineInterfaceTypes';
import AceEditor from 'react-ace';
//import 'ace-builds/src-noconflict/theme-alive';
import './mode-alivescript';
import EditorTab from '../../AliveScriptComponents/EditorTab/EditorTab';
import { useState } from 'react';

const LineInterface = ({
	hasTabs,
	tabs: initialTabs,
	content,
	handleChange,
}: LineInterfaceProps) => {
	const [tabs, setTabs] = useState<EditorTabModel[]>(() => {
		if (!hasTabs) return [];
		return (
			initialTabs || [
				{
					title: 'New tab',
					open: true,
				},
			]
		);
	});

	const setOpenedTab = (idx: number) => {
		const updatedTabs = tabs.map((t, i) => {
			t.open = i === idx;
			return t;
		});
		setTabs(updatedTabs);
	};

	const onEditorChange = (content: string, tab?: EditorTabModel) => {
		tab && tab.onChange && tab.onChange(content);
		handleChange(content);
	};

	return (
		<StyledLineInterface>
			{hasTabs && (
				<div className="editors-tab w-100">
					{tabs.map((t, idx) => (
						<EditorTab key={idx} tab={t} setOpen={() => setOpenedTab(idx)} />
					))}
				</div>
			)}
			{hasTabs ? (
				<>
					{tabs.map((t, idx) => {
						return (
							<AceEditor
								key={idx}
								className={
									'ace-editor relative w-100 h-100 ' +
									(!t.open && t.loaded ? 'hidden-editor' : '')
								}
								defaultValue={t.content}
								enableSnippets
								enableBasicAutocompletion
								enableLiveAutocompletion
								mode="alivescript"
								theme="simplifie"
								onLoad={() => {
									// To only hide the tab editor once it loaded
									setTimeout(() => {
										tabs[idx].loaded = true;
										setTabs([...tabs]);
									}, 100);
								}}
								onChange={content => onEditorChange(content, t)}
								fontSize="large"
								name="1nt3rf4c3" //"UNIQUE_ID_OF_DIV"
								editorProps={{ $blockScrolling: true }}
							/>
						);
					})}
				</>
			) : (
				<AceEditor
					className="ace-editor relative w-100 h-100"
					enableSnippets
					enableBasicAutocompletion
					enableLiveAutocompletion
					mode="alivescript"
					theme="alive"
					defaultValue={content}
					onChange={content => onEditorChange(content)}
					fontSize="large"
					name="1nt3rf4c3" //"UNIQUE_ID_OF_DIV"
					editorProps={{ $blockScrolling: true }}
				/>
			)}
		</StyledLineInterface>
	);
};

export default LineInterface;