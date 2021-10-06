import { Form } from 'react-bootstrap';
import { StyledMDEditor, MDEditorProps } from './mdEditorTypes';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Button from '../../UtilsComponents/Button/Button';

const MDEditor = ({ onSave, defaultValue }: MDEditorProps) => {
	const [isPreview, setIsPreview] = useState(false);
	const [content, setContent] = useState(defaultValue ?? '');

	return (
		<StyledMDEditor>
			<div className="editor-header">
				<div onClick={() => setIsPreview(false)}>Edit</div>
				<div onClick={() => setIsPreview(true)}>Preview</div>
			</div>
			<div className="editor-body">
				{!isPreview ? (
					<Form.Control
						onChange={e => setContent(e.target.value)}
						as="textarea"
						value={content}
					/>
				) : (
					<ReactMarkdown>{content}</ReactMarkdown>
				)}
			</div>
			<div className="editor-footer">
				<Button onClick={() => onSave && onSave(content)} variant="primary">
					Save
				</Button>
			</div>
		</StyledMDEditor>
	);
};

export default MDEditor;