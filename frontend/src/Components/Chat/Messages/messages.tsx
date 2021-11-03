import React, { useEffect } from 'react';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import './message.css';

type PropsMessage = {
	username: string;
	text: string;
	image: string;
	_id: string;
	date: string;
};

const Message: React.FC<PropsMessage> = props => {
	return (
		<div className="messageContainer">
			<img className="image" alt="User" src={props.image} />
			<div className="textBox">
				<p className="username">
					{props.username} <span className="date">{props.date}</span>
				</p>
				<p className="message">{props.text}</p>
			</div>
		</div>
	);
};

type PropsMessages = {
	messages: PropsMessage[];
	onClick: () => void;
	loading: boolean;
};

const Messages: React.FC<PropsMessages> = props => {
	useEffect(() => {
		const chatElement = document.getElementById('chat');
		if (chatElement) {
			chatElement.scrollTop = chatElement.scrollHeight;
		}
	});

	return (
		<div id="chat" className="container" onClick={props.onClick}>
			{props.loading ? (
				<div className="loading">
					<LoadingScreen />
				</div>
			) : (
				<div className="wrapper">
					{props.messages.map(message => (
						<Message
							_id={message._id}
							key={message._id}
							username={message.username}
							text={message.text}
							image={message.image}
							date={message.date}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default Messages;
