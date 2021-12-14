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
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Result } from '../../../Models/Social/result.entity';
import api from '../../../Models/api';

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
	const moyenne = 60;
	const color = (value: any) => {
		if (value > moyenne) return 'gold';
		else if (value > 30) return 'orange';
		else return 'red';
	};
	const [resultQuizz, setResultQuizz] = useState<Result[]>([]);
	const [resultCount, setCountQuizz] = useState<Result>();
	let countSuccess: any[] = [];
	const { register, handleSubmit } = useForm();

	const onSubmit = async (image: { file: any }) => {
		let fileData = new FormData();
		fileData.append('image', image.file[0]);
		await axios.post('users/upload', fileData, {
			headers: {
				'Content-Type': image.file[0].type,
			},
		});
		window.location.reload();
	};

	useEffect(() => {
		const getProjects = async () => {
			if (!user) return;
			const resultQuizz = await api.db.results.getresultuser({});
			setResultQuizz(resultQuizz);
			const resultCount = await api.db.results.findandcount({
				percentage: 60,
			});
			setCountQuizz(resultCount);
		};
		getProjects();
	}, [user]);

	resultQuizz.map(p => {
		if (p.percentage > moyenne) {
			return countSuccess.push(p);
		}
		return '';
	});
	return (
		<>
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
												<input
													type="file"
													{...register('file', { required: true })}
												/>
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
								<h3 className="text-left col-sm-5" key="resulcount">
									{t('user.quiz')} {resultCount}/10
								</h3>
								<h3 className="text-left col-sm-7" key="userReward">
									{t('user.reward')} {countSuccess.length}/40
								</h3>
								<h3 className="text-left col-sm-5" key="userStatus">
									{t('user.status')} Noob
								</h3>
								<h3 className="text-left col-sm-7 " key="userRank">
									{t('user.rank')} #1
								</h3>
								<h3 className="text-left col-sm-5" key="userPost">
									{t('user.posts')} 0
								</h3>
								<h3 className="text-left col-sm-7" key="autre">
									Autre
								</h3>
							</Row>
						</CardContainer>
					</div>
				</Row>
			</StyledCenteredContainer>
			<StyledCenteredContainer key="cont2">
				<CardContainer key="cardQuizz" title="Quiz">
					<Row style={{ paddingTop: '20px' }}>
						{resultQuizz.map((p, idx) => (
							<>
								<div className=" col-sm-2" key={`result + ${idx}`}>
									<CircularProgressbar
										key={'Progressbar' + idx}
										value={p.percentage}
										text={`${p.percentage}%`}
										styles={buildStyles({ trailColor: color(p.percentage) })}
									/>
									<h3>{p.quiz.name}</h3>
								</div>
							</>
						))}
					</Row>
				</CardContainer>
			</StyledCenteredContainer>
			<StyledCenteredContainer>
				<CardContainer title={t('user.rewardTitle')}>
					<Row style={{ padding: '20px' }}>
						{countSuccess.map((p, idx) => (
							<div className=" col-auto" key={`reward', ${idx}`}>
								<div style={{ paddingRight: '20px' }}>
									<img
										height={100}
										width={100}
										src={`http://localhost:8000/rewards/${p.quiz.reward.name}`}
										alt={p.quiz.reward.name}
									/>
								</div>
								<h3>{p.quiz.reward.name.split('.')[0]}</h3>
							</div>
						))}
					</Row>
				</CardContainer>
			</StyledCenteredContainer>
		</>
	);
};

export default AccountPage;

