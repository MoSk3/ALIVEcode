import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import './accountPage.css';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import { Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import AboutCard from '../../../Components/UtilsComponents/Cards/AboutCard/AboutCard';
import { useTranslation } from 'react-i18next';
import GamepadAlive from '../../../Components/Gamepad/GamepadAlive';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Result } from '../../../Models/Social/result.entity';
import api from '../../../Models/api';
import Messages from '../../../Components/Chat/Messages/messages';

const StyledCenteredContainer = styled(CenteredContainer)`
	padding: 0 10% 0 10%;

	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;

const AccountPage = () => {
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const color = (value: any) => {
		if (value > 60) return 'gold';
		else if (value > 30) return 'orange';
		else return 'red';
	};
	//const [loading, setLoading] = useState(true);
	const [resultQuizz, setResultQuizz] = useState<Result[]>([]);

	const { register, handleSubmit } = useForm();
	const onSubmit = async (image: { file: any }) => {
		let fileData = new FormData();
		fileData.append('image', image.file[0]);
		console.log(fileData);
		await axios.post('users/upload', fileData, {
			headers: {
				'Content-Type': image.file[0].type,
			},
		});
	};

	useEffect(() => {
		const getProjects = async () => {
			if (!user) return;
			const resultQuizz = await api.db.results.getresultuser({});
			setResultQuizz(resultQuizz);
		};
		getProjects();
	}, [user]);

	return (
		<>
			<CardContainer
				asRow
				height="200px"
				className="iot-container"
				title="My projects"
			>
				{resultQuizz && resultQuizz.length > 0 ? (
					resultQuizz.map((p, idx) => <>{console.log(p, idx)}</>)
				) : (
					<div>Aucun projet</div>
				)}
			</CardContainer>
			<StyledCenteredContainer>
				<Row>
					<div className="col-md-6">
						<div className="pb-5">
							<CardContainer title="Profil">
								{!user ? (
									<FontAwesomeIcon icon={faSpinner} />
								) : (
									<>
										<Row>
											<AboutCard
												name={user.getDisplayName()}
												img={`http://localhost:8000/uploads/${user.getDisplayImage()}`}
											/>
										</Row>
										<Form onSubmit={handleSubmit(onSubmit)}>
											<Form.Row>
												<input type="file" {...register('file')} />
											</Form.Row>
											<Form.Row>
												<button type="submit">upload</button>
											</Form.Row>
										</Form>
									</>
								)}
							</CardContainer>
						</div>
					</div>
					<div className="col-md-5  offset-md-1">
						<CardContainer title="Avancement">
							<Row>
								<h3 className="text-left col-sm-5">{t('user.quiz')} 0/10</h3>
								<h3 className="text-left col-sm-7">{t('user.reward')} 10/40</h3>
								<h3 className="text-left col-sm-5">{t('user.status')} Noob</h3>
								<h3 className="text-left col-sm-7">{t('user.rank')} #1</h3>
								<h3 className="text-left col-sm-5">{t('user.posts')} 0</h3>
								<h3 className="text-left col-sm-7">Autre</h3>
							</Row>
						</CardContainer>
					</div>
				</Row>
			</StyledCenteredContainer>
			<StyledCenteredContainer>
				<CardContainer title="Quiz">
					<Row style={{ paddingTop: '20px' }}>
						{resultQuizz.map((p, idx) => (
							<>
								<div className=" col-sm-2">
									<CircularProgressbar
										value={p.percentage}
										text={`${p.percentage}%`}
										styles={buildStyles({ trailColor: color(p.percentage) })}
									/>
									<h3>IOT</h3>
									{console.log(p, idx)}
								</div>
							</>
						))}
					</Row>
				</CardContainer>
			</StyledCenteredContainer>
			<StyledCenteredContainer>
				<CardContainer title={t('user.rewardTitle')}>
					<Row style={{ padding: '20px' }}>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" alt="" />
						</div>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" alt="" />
						</div>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" alt="" />
						</div>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" alt="" />
						</div>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" alt="" />
						</div>
						<div>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" alt="" />
						</div>
					</Row>
				</CardContainer>
			</StyledCenteredContainer>
		</>
	);
};

export default AccountPage;

