import ReactMarkdown from "react-markdown";
import { useState, useEffect } from 'react';
import mdPath from './asDocs.md';
import styled from 'styled-components';

const StyledDiv = styled.div`
	padding: 80px;
	background-color: rgba(var(--background-color-rgb), 0.5);
`;

const ASDocs = () => {
	const [text, setText] = useState('');

	useEffect(() => {
		fetch(mdPath)
			.then(res => res.text())
			.then(text => setText(text));
	}, []);

	return (
		<StyledDiv>
			<ReactMarkdown>{text}</ReactMarkdown>
		</StyledDiv>
	);
};

export default ASDocs;