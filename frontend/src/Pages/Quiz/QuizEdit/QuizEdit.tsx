import { plainToClass } from "class-transformer";
import { useState, useEffect } from "react";
import { Card, Form, Button, Table } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import api from '../../../Models/api';
import { Category } from '../../../Models/Quiz/categories-quiz.entity';
import { Quiz } from '../../../Models/Quiz/quiz.entity';
import { QuizForm } from '../../../Models/Quiz/quizForm.entity';
import { QuizCategoryProps } from '../QuizCategory/Category';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const QuizEdit = (props: QuizCategoryProps) => {
	const history = useHistory();

	async function updateQuiz(data: QuizForm) {
		const response = await api.db.quiz.update(
			{
				id: props.match.params.id,
			},
			data,
		);
		console.log(response);
		history.push(`/quiz/category/${data.category.id}`);
	}

	const [categories, setCategories] = useState<Category[]>([]);
	const [quiz, setQuiz] = useState<Quiz>();

	const { register, handleSubmit } = useForm<QuizForm>();
	const onSubmit: SubmitHandler<Quiz> = data => updateQuiz(data);
	useEffect(() => {
		const getCategories = async () => {
			const data = await api.db.quiz.categories.all({});
			setCategories(data.map((d: any) => plainToClass(Category, d)));
		};
		const getQuiz = async () => {
			const response = await api.db.quiz.one({ id: props.match.params.id });
			console.log(response);
			setQuiz(plainToClass(Quiz, response));
		};
		getCategories();
		getQuiz();
	}, [props.match.params.id]);

	async function handleDeleteQuestion(id: any) {
		const response = await api.db.question.delete({
			id,
		});
		console.log(response);
		if (response.status === 200) {
			window.location.reload();
		}
	}

	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="left"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<Card>
					<Card.Body>
						<h1>Edit your Quiz!</h1>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Form.Group>
								<Form.Label>Quiz Category</Form.Label>
								<Form.Control
									as="select"
									aria-label=""
									{...register('category.id')}
								>
									<option></option>
									{categories.map(category => {
										return <option value={category.id}>{category.name}</option>;
									})}
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quiz Name</Form.Label>
								<Form.Control {...register('name')}></Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quiz Description</Form.Label>
								<Form.Control
									as="textarea"
									rows={5}
									{...register('description')}
								></Form.Control>
							</Form.Group>
							{
								// Questions will follow
								console.log(quiz?.questions)
							}

							<Button variant="primary" type="submit">
								Update!
							</Button>
							<br />
							<br />
							{
								// Should now redirect to the quiz category page to show the quiz has been updated
							}
						</Form>
						<Link to={`/quiz/edit/${quiz?.id}/new-question`}>
							<Button>Ajouter une Question!</Button>
						</Link>
					</Card.Body>
				</Card>
				{quiz?.questions.map(question => {
					return (
						<div>
							<br />
							<Card>
								<Card.Body>
									<p>{question.name}</p>
									<br />
									<Button
										onClick={() => {
											handleDeleteQuestion(question.id);
										}}
									>
										Delete
									</Button>
									<Table>
										<tbody>
											{question.answers.map(answer => {
												console.log(answer);
												return (
													<tr>
														<td>{answer.value}</td>
														<td>{String(answer.is_good)}</td>
													</tr>
												);
											})}
										</tbody>
									</Table>
								</Card.Body>
							</Card>
							<br />
						</div>
					);
				})}
			</CenteredContainer>
		</div>
	);
};

export default QuizEdit;