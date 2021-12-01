import { useContext, useEffect, useRef, useState } from "react";
import { Container, Card, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../state/contexts/UserContext';
import Messages from '../Messages/messages';

const MessageForm = () => {
	const { user } = useContext(UserContext);
	const { register, handleSubmit } = useForm();
	const socket: any = useRef();
	const [messages, setMessages]: any = useState([]);
	const [users, setUsers]: any = useState([]);

	useEffect(() => {
		if (!process.env.REACT_APP_CHAT_URL)
			throw new Error('REACT_APP_CHAT_URL .env variable not set');

		socket.current = new WebSocket(process.env.REACT_APP_CHAT_URL);

		socket.current.onopen = () => {
			console.log(user);
			console.log('Connected to Chat');
			if (user) {
				socket.current.send(
					JSON.stringify({
						event: 'user_connected',
						data: {
							name: user.getDisplayName(),
						},
					}),
				);
			}
			socket.current.onmessage = (e: any) => {
				console.log(e.data);
				const data = JSON.parse(e.data);
				if (data.event === 'messageToClient') {
					const message = data;
					const incomingMessage = {
						...message,
						ownedByCurrentUser:
							message.data.message_user === user?.getDisplayName(),
					};
					console.log(incomingMessage);
					setMessages((messages: any) => [...messages, incomingMessage]);
				}
				if (data.event === 'user_connected') {
					console.log(data);
					setUsers([...users, data]);
				}
			};
		};

		return () => {
			socket.current.close();
		};
	}, [user]);

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
			<div className="col-md-7">
				<Card>
					<Container
						className="card-container-body"
						style={{
							overflow: 'auto',
							height: ' 530px',
							borderRadius: 1,
							overflowY: 'auto',
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
					</Container>
					<Container>
						<Row>
							<div className="input-group mb-10">
								<input
									className="form-control"
									placeholder="message"
									type="text"
									{...register('message')}
								/>
								<button
									className="btn"
									style={{ background: '#0177bc' }}
									onClick={handleSubmit(onSubmit)}
								>
									Send Message
								</button>
							</div>
						</Row>
					</Container>
				</Card>
			</div>
			<div className="col-sm-2">
				<Card style={{ height: '100%' }}>
					<div className="list-group">
						{users.map((user: any, idx: any) => {
							{
								console.log('user' + user.name);
							}

							return (
								<div className="list-group-item " key={idx}>
									{user.name}
								</div>
							);
						})}
					</div>
				</Card>
			</div>
		</>
	);
};
export default MessageForm;
