import React from "react";
import Messages from "../Messages/messages";

const dummyData = [
	{
		senderId: 'Jonh',
		text: 'coucou',
	},
	{
		senderId: 'Jane',
		text: 'prout',
	},
	{
		senderId: 'Bruce',
		text: 'Batmaaaaaaan',
	},
];

const MessageList = () => {
	return (
		<div className="messagelist">
			{dummyData.map((message, idx) => {
				return (
					<Messages key={idx} username={message.senderId} text={message.text} />
				);
			})}
		</div>
	);
};
export default MessageList;
