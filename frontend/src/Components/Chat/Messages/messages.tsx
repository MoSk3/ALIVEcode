

const Messages = (props: { username: string; text: string }) => {
	return (
		<div className="message">
			<div className="message-user">{props.username}</div>
			<div className="message-text">{props.text}</div>
		</div>
	);
};
export default Messages;
