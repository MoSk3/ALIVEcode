import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
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
			console.log('Connected to Chat');
			socket.current.onmessage = (e: { data: string }) => {
				console.log(e);
				const message = JSON.parse(e.data);
				const incomingMessage = {
					...message.,
					ownedByCurrentUser:
						message.data.message_user === user?.getDisplayName(),
				};
				console.log(incomingMessage);
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
		<div className="col-md-7">
			<div className="card-container-title"> CHAT</div>

			<div
				className="card-container-body"
				style={{
					overflow: 'auto',
					height: '700px ',
				}}
			>
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
			<Container>
				<Row>
					<Form
						onSubmit={handleSubmit(onSubmit)}
						style={{ position: 'fixed', bottom: 150 }}
					>
						<input placeholder="message" type="text" {...register('message')} />
						<button type="submit">send</button>
					</Form>
				</Row>
			</Container>
		</div>
	);
};
export default MessageForm;
