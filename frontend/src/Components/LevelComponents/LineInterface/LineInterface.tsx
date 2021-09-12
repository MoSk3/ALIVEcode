import { LineInterfaceProps, StyledLineInterface, EditorTabModel } from './lineInterfaceTypes';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-alive';
import './mode-alivescript';
import EditorTab from '../../AliveScriptComponents/EditorTab/EditorTab';
import { useState } from 'react';

const LineInterface = ({
	hasTabs,
	tabs: initialTabs,
	content: defaultContent,
	handleChange,
}: LineInterfaceProps) => {
	/* Content for a multiple tabs interface */
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
	/* Content for a single tab interface */
	const [content, setContent] = useState<string>(defaultContent ?? '');

	const setOpenedTab = (idx: number) => {
		const updatedTabs = tabs.map((t, i) => {
			if (i === idx) handleChange(t.defaultContent);
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
					{tabs.map((t, idx) => {
						return (
							<EditorTab key={idx} tab={t} setOpen={() => setOpenedTab(idx)} />
						);
					})}
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
								defaultValue={t.defaultContent}
								enableSnippets
								enableBasicAutocompletion
								enableLiveAutocompletion
								mode="alivescript"
								theme="alive"
								onLoad={() => {
									// To only hide the tab editor once it loaded
									setTimeout(() => {
										// Set default content in parent prop
										if (t.open) handleChange(t.defaultContent);

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
					defaultValue={defaultContent}
					value={content}
					onChange={content => {
						setContent(content);
						onEditorChange(content);
					}}
					onLoad={() => {
						handleChange(defaultContent);
					}}
					fontSize="large"
					name="1nt3rf4c3" //"UNIQUE_ID_OF_DIV"
					editorProps={{ $blockScrolling: true }}
				/>
			)}
		</StyledLineInterface>
	);
};

export default LineInterface;