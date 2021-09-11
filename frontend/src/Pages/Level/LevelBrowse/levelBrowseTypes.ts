import styled from 'styled-components';
export type LevelBrowseProps = {};

export const StyledLevelBrowse = styled.div`
	width: 100%;
	padding: 100px;
	position: relative;

	.levels {
		position: relative;
		width: 100%;
		padding: 50px;
		min-height: 300px;
		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;
		background-color: var(--background-color);
	}
`;