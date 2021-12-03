import { SetStateAction, useContext, useEffect, useRef, useState } from "react";
import {
	Container,
	Card,
	Row,
	Form,
	Dropdown,
	DropdownButton,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../state/contexts/UserContext';
import Messages from '../Messages/messages';
import Picker from 'emoji-picker-react';

const MessageForm = ({ activeTopic }: any) => {
	const { user } = useContext(UserContext);
	const { register, handleSubmit, reset } = useForm();
	const socket: any = useRef();
	const [messages, setMessages]: any = useState([]);
	const [users, setUsers]: any = useState([]);
	const [input, setInput]: any = useState('');
	const inputRef = useRef(null);

	useEffect(() => {
		if (!user) return;

		if (!process.env.REACT_APP_CHAT_URL)
			throw new Error('REACT_APP_CHAT_URL .env variable not set');

		socket.current = new WebSocket(process.env.REACT_APP_CHAT_URL);

		socket.current.onopen = () => {
			console.log('Connected to Chat');

			socket.current.send(
				JSON.stringify({
					event: 'user_connected',
					data: {
						name: user.getDisplayName(),
					},
				}),
			);
		};

		socket.current.onmessage = (e: any) => {
			const data = JSON.parse(e.data);
			if (data.event === 'messageToClient') {
				const message = data;
				const incomingMessage = {
					...message,
					ownedByCurrentUser:
						message.data.message_user === user.getDisplayName(),
				};
				setMessages((messages: any) => [...messages, incomingMessage]);
			}
			if (data.event === 'user_connected') {
				setUsers(data.data);
			}
		};

		socket.current.close = () => {
			console.log('disconnected');
		};
	}, [user]);
	const onSubmit = () => {
		const today = new Date();
		socket.current.send(
			JSON.stringify({
				event: 'send_message',
				data: {
					active_topic: activeTopic,
					message_user: user?.getDisplayName(),
					image_user: user?.getDisplayImage(),
					message: input,
					time:
						today.getHours() +
						':' +
						today.getMinutes() +
						':' +
						('0' + (today.getSeconds() + 1)).slice(-2),
				},
			}),
		);
		setInput('');
	};
	const onEmojiClick = (e: any, emojiObject: any) => {
		const { selectionStart, selectionEnd }: any = inputRef.current;
		// replace selected text with clicked emoji
		const newVal: any =
			input.slice(0, selectionStart) +
			emojiObject.emoji +
			input.slice(selectionEnd);
		setInput(newVal);
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
							console.log(message);
							return (
								activeTopic === message.data.active_topic && (
									<Messages
										key={idx}
										username={
											message.data.message_user !== `${user?.getDisplayName()}`
												? message.data.message_user
												: 'yourself'
										}
										image={message.data.image_user}
										text={message.data.message}
										time={message.data.time}
									/>
								)
							);
						})}
					</Container>
					<Container>
						<Form>
							<Row>
								<div className="input-group mb-10">
									<input
										className="form-control"
										type="text"
										ref={inputRef}
										placeholder="Entrer votre message"
										value={input}
										onChange={e => setInput(e.target.value)}
									/>
									<DropdownButton
										id="dropdown-button-drop-end"
										drop="up"
										variant="secondary"
										title={` Drop end `}
									>
										<Picker onEmojiClick={onEmojiClick} />
									</DropdownButton>

									<button
										className="btn"
										style={{ background: '#0177bc' }}
										onClick={handleSubmit(onSubmit)}
									>
										Send Message
									</button>
								</div>
							</Row>
						</Form>
					</Container>
				</Card>
			</div>
			<div className="col-sm-2">
				<Card style={{ height: '100%' }}>
					<div className="list-group">
						{users.map((userConnected: any, idx: any) => {
							return (
								<div className="list-group-item " key={idx}>
									{userConnected.name !== `${user?.getDisplayName()}`
										? userConnected.name
										: `${userConnected.name} (me)`}
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
