import { Form } from 'react-bootstrap';
import { StyledMDEditor, MDEditorProps } from './mdEditorTypes';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Button from '../../UtilsComponents/Button/Button';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks';

import 'katex/dist/katex.min.css';
import { remarkAlbum } from './remark-album';
import { rehypeAlbum } from './rehype-album';

const MDEditor = ({ onSave, defaultValue }: MDEditorProps) => {
	const [isPreview, setIsPreview] = useState(false);
	const [content, setContent] = useState(defaultValue ?? '');

	useEffect(() => {
		defaultValue && setContent(defaultValue);
	}, [defaultValue]);

	return (
		<StyledMDEditor>
			<div className="editor-header">
				<div onClick={() => setIsPreview(false)}>Edit</div>
				<div onClick={() => setIsPreview(true)}>Preview</div>
			</div>
			<div className="editor-toolbar">
				<div>Color</div>
				<div>Math</div>
			</div>
			<div className="editor-body">
				{!isPreview ? (
					<Form.Control
						onChange={e => setContent(e.target.value)}
						as="textarea"
						value={content}
					/>
				) : (
					<ReactMarkdown
						remarkPlugins={[
							remarkAlbum.underline,
							//remarkGfm,
							//remarkMath,
							//remarkBreaks,
						]}
						//rehypePlugins={[rehypeKatex]}
						rehypePlugins={[rehypeAlbum]}
					>
						{content}
					</ReactMarkdown>
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