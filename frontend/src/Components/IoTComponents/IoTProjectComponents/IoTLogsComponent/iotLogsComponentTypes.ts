import styled from 'styled-components';

export const StyledIoTLogsComponent = styled.div`
	position: relative;
	height: 230px;
	margin: 5px;

	.log-content {
		position: relative;
		height: 200px;
		padding: 20px;
	}

	background-color: var(--primary-color);

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