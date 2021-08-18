import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FillContainer from '../FillContainer/FillContainer';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const StyledSpinner = styled.div`
	& {
		color: var(--primary-color);
	}

	@-webkit-keyframes rotating /* Safari and Chrome */ {
		from {
			-webkit-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@keyframes rotating {
		from {
			-ms-transform: rotate(0deg);
			-moz-transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		to {
			-ms-transform: rotate(360deg);
			-moz-transform: rotate(360deg);
			-webkit-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	.rotating {
		-webkit-animation: rotating 1s linear infinite;
		-moz-animation: rotating 1s linear infinite;
		-ms-animation: rotating 1s linear infinite;
		-o-animation: rotating 1s linear infinite;
		animation: rotating 1s linear infinite;
	}
`;

const LoadingScreen = () => {
	return (
		<FillContainer centered startAtTop style={{ textAlign: 'center' }}>
			<div>
				<StyledSpinner>
					<FontAwesomeIcon
						className="rotating"
						size="5x"
						icon={faSpinner}
					></FontAwesomeIcon>
				</StyledSpinner>
			</div>
		</FillContainer>
	);
};

export default LoadingScreen;