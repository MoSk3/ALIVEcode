import MessageForm from '../../Components/Chat/MessageForm/messageForm';
import styled from 'styled-components';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';

import { Card } from 'react-bootstrap';
import { useRef, useState } from 'react';
const StyledCenteredContainer = styled(CenteredContainer)`
	display: flex;
	width: 100%;
	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;

const Chat = () => {
	return (
		<div className="section">
			<div
				className="top"
				style={{
					backgroundColor: '#0177bc',
					color: '#FFF',
					textAlign: 'center',
				}}
			>
				<h1>REACT CHAT APPLICATION</h1>
				<h1>CHAT</h1>
			</div>
			<div className="Chat">
				<StyledCenteredContainer className="chat">
					<div className="text-left col-sm-3">
						<Card style={{ height: '100%' }}>
							<div className="list-group">
								<div
									className="list-group-item list-group-item-action
                      "
								>
									topic 1
								</div>
							</div>
						</Card>
					</div>
					<MessageForm />
				</StyledCenteredContainer>
			</div>
		</div>
	);
};

export default Chat;