import { plainToClass } from "class-transformer";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import api from '../../../Models/api';
import { Category } from '../../../Models/Quiz/categories-quiz.entity';
import { QuizCategoryProps } from '../QuizCategory/Category';

const QuizCreate = (props: QuizCategoryProps) => {
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		const getCategories = async () => {
			const data = await api.db.quiz.categories.all({});
			setCategories(data.map((d: any) => plainToClass(Category, d)));
		};
		getCategories();
	}, []);

	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="left"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<Card>
					<Card.Body>
						<h1>Create your Quiz!</h1>
						<Form>
							<Form.Group>
								<Form.Label>Quiz Category</Form.Label>
								<Form.Control as="select" aria-label="">
									<option></option>
									{categories.map(category => {
										return <option value={category.id}>{category.name}</option>;
									})}
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quiz Name</Form.Label>
								<Form.Control></Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quiz Description</Form.Label>
								<Form.Control as="textarea" rows={5}></Form.Control>
							</Form.Group>
							<Button variant="primary" type="submit">
								Create
							</Button>
							{
								// Should now redirect to the quiz category page to show the quiz has been created
							}
						</Form>
					</Card.Body>
				</Card>
			</CenteredContainer>
		</div>
	);
};

export default QuizCreate;