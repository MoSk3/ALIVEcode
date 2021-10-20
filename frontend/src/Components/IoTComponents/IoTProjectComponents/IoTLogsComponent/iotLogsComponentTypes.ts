import styled from 'styled-components';

export const StyledIoTLogsComponent = styled.div`
	position: relative;
	height: 230px;
	margin: 10px;
	background-color: var(--background-color);
	border: 1px solid var(--bg-shade-four-color);

	.log-content {
		position: relative;
		height: 200px;
		padding: 20px;
	}

	.log-title {
		font-size: 1.3em;
		border-bottom: 1px solid white;
		margin-bottom: 3px;
	}

	.log-entries {
		height: 100%;
		overflow-y: auto;
	}
`;