

const Messages = (props: { username: string; text: string; time: any }) => {
	return (
		<div className="message">
			<div className="message-user">{props.username}</div>
			<div className="message-text">{props.text}</div>
			<div className="message-time">{props.time}</div>
		</div>
	);
};
export default Messages;
