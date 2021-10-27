import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { Professor, Student } from '../../../Models/User/user.entity';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import './accountPage.css';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import { Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import AboutCard from '../../../Components/UtilsComponents/Cards/AboutCard/AboutCard';
import { useTranslation } from 'react-i18next';
import GamepadAlive from '../../../Components/Gamepad/GamepadAlive';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';

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
	const percentage = 33;
	const percentageIOT = 77;
	const percentage2 = 12;
	const percentage3 = 88;
	const percentage4 = 57;
	const color = (value: any) => {
		if (value > 60) return 'gold';
		else if (value > 30) return 'orange';
		else return 'red';
	};

	const { register, handleSubmit } = useForm();
	const onSubmit = async (data: { file: any[] }) => {
		console.log(data.file[0]);
		await axios.post('users/upload', data.file[0]);
	};
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
												img="https://i.imgur.com/xkH6wCg.png"
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
						<div className=" col-sm-2">
							<CircularProgressbar
								value={percentageIOT}
								text={`${percentageIOT}%`}
								styles={buildStyles({ trailColor: color(percentageIOT) })}
							/>
							<h3>IOT</h3>
						</div>
						<div className=" col-sm-2">
							<CircularProgressbar
								value={percentage}
								text={`${percentage}%`}
								styles={buildStyles({ trailColor: color(percentage) })}
							/>
						</div>
						<div className=" col-sm-2">
							<CircularProgressbar
								value={percentage2}
								text={`${percentage2}%`}
								styles={buildStyles({ trailColor: color(percentage2) })}
							/>
						</div>
						<div className=" col-sm-2">
							<CircularProgressbar
								value={percentage3}
								text={`${percentage3}%`}
								styles={buildStyles({ trailColor: color(percentage3) })}
							/>
						</div>
						<div className=" col-sm-2">
							<CircularProgressbar
								value={percentage4}
								text={`${percentage4}%`}
								styles={buildStyles({ trailColor: color(percentage4) })}
							/>
						</div>
					</Row>
				</CardContainer>
			</StyledCenteredContainer>
			<StyledCenteredContainer>
				<CardContainer title={t('user.rewardTitle')}>
					<Row style={{ padding: '20px' }}>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div style={{ paddingRight: '20px' }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
					</Row>
				</CardContainer>
				<GamepadAlive></GamepadAlive>
			</StyledCenteredContainer>
		</>
	);
};

export default AccountPage;

