import { useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from 'react-hook-form';

const MessageForm = () => {
	const { register, handleSubmit } = useForm();
	const onSubmit = (message: any) => console.log(message);

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<input placeholder="message" type="text" {...register('message')} />
		</Form>
	);
};
export default MessageForm;
