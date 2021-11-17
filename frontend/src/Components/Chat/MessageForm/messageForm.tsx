import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { User } from '../../../Models/User/user.entity';
import { UserContext } from '../../../state/contexts/UserContext';
import Messages from '../Messages/messages';

const MessageForm = () => {
	const { user } = useContext(UserContext);
	const { register, handleSubmit } = useForm();
	const socket: any = useRef();
	const [messages, setMessages]: any = useState([]);

	useEffect(() => {
		if (!process.env.REACT_APP_CHAT_URL)
			throw new Error('REACT_APP_CHAT_URL .env variable not set');

		socket.current = new WebSocket(process.env.REACT_APP_CHAT_URL);

		socket.current.onopen = () => {
			if (process.env.REACT_APP_DEBUG) console.log('Connected to Chat');
			socket.current.onmessage = (e: { data: string }) => {
				const message = JSON.parse(e.data);
				const incomingMessage = {
					...message,
					ownedByCurrentUser: message.senderId === socket.current.id,
				};
				setMessages((messages: any) => [...messages, incomingMessage]);
			};
		};

		return () => {
			socket.current.close();
		};
	}, []);

	const onSubmit = (data: any) => {
		const today = new Date();
		socket.current.send(
			JSON.stringify({
				event: 'send_message',
				data: {
					message_user: user?.getDisplayName(),
					message: data.message,
					time:
						today.getHours() +
						':' +
						today.getMinutes() +
						':' +
						('0' + (today.getSeconds() + 1)).slice(-2),
				},
			}),
		);
	};
	return (
		<>
			<div className="messagelist">
				{messages.map((message: any, idx: any) => {
					return (
						<Messages
							key={idx}
							username={message.data.message_user}
							text={message.data.message}
							time={message.data.time}
						/>
					);
				})}
			</div>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<input placeholder="message" type="text" {...register('message')} />
				<button type="submit">send</button>
			</Form>
		</>
	);
};
export default MessageForm;
