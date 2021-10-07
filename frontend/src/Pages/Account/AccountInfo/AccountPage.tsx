import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { Professor, Student } from '../../../Models/User/user.entity';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import './accountPage.css'
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import { Row } from 'react-bootstrap';
import styled from 'styled-components';
import AboutCard from '../../../Components/UtilsComponents/Cards/AboutCard/AboutCard';


const StyledCenteredContainer = styled(CenteredContainer)`
	padding: 0 10% 0 10%;

	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;

const AccountPage = () => {
	const { user } = useContext(UserContext);
	const percentage = 33;
	const percentageIOT = 77;
	const percentage2 = 12;
	const percentage3 = 88;
	const percentage4 = 57;
	const color = (value: any) => {
		if (value >60) return "gold"
	else if (value > 30) return "orange"
	else return "red" 
	} 

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
									<Row >
										
										<AboutCard name= {user.getDisplayName()} img= "https://i.imgur.com/xkH6wCg.png"/>
								
										{user instanceof Professor && (
											<>
												
												<h1 defaultValue={user.firstName} />
										
												<h1 defaultValue={user.lastName} />
												
											</>
										)}
										<div  className="text-left col-sm-6">
											<h2>Description</h2>
											<h3>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend tempus consequat. 
												Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.	
											</h3>
									</div>
									</Row>


								)}	
								{user instanceof Student && (
											<>
												<label>Nom</label>
												<input defaultValue={user.name} />
											</>
										)}
							</CardContainer>
						</div>
					</div>
					<div className="col-md-5  offset-md-1">
						<CardContainer title="Avancement">
							
							<Row>
								<h3 className="text-left col-sm-5">Quiz: 0/10</h3>
								<h3 className="text-left col-sm-7">Récompenses: 10/40</h3>
								<h3 className="text-left col-sm-5">Status: Noob</h3>
								<h3 className="text-left col-sm-7">Rank #1</h3>
								<h3 className="text-left col-sm-5">Posts: 0</h3>
								<h3 className="text-left col-sm-7">Autre</h3>
							</Row>
						</CardContainer>
					</div>

				</Row>
			</StyledCenteredContainer>
			<StyledCenteredContainer>								
				<CardContainer title="Quiz" >
					<Row style= {{paddingTop: '20px'}}>
						
						<div className=" col-sm-2">
							<CircularProgressbar value={percentageIOT} text={`${percentageIOT}%`} styles={buildStyles({trailColor: color(percentageIOT)})} />
							<h3>IOT</h3>
						</div>
						<div className=" col-sm-2">
							<CircularProgressbar value={percentage} text={`${percentage}%`}  styles={buildStyles({trailColor: color(percentage)})}/>
						</div>
						<div className=" col-sm-2">
							<CircularProgressbar value={percentage2} text={`${percentage2}%`}  styles={buildStyles({trailColor: color(percentage2)})}/>
						</div>
						<div className=" col-sm-2">
							<CircularProgressbar value={percentage3} text={`${percentage3}%`}  styles={buildStyles({trailColor: color(percentage3)})}/>
						</div>
						<div className=" col-sm-2">
							<CircularProgressbar value={percentage4} text={`${percentage4}%`}  styles={buildStyles({trailColor: color(percentage4)})}/>
						</div>
					</Row>
				</CardContainer>
			</StyledCenteredContainer>

			<StyledCenteredContainer>
				<CardContainer title="Recompenses" >
					<Row style={{ padding: '20px' , }}>
						<div style={{ paddingRight: '20px' , }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div style={{ paddingRight: '20px' , }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div style={{ paddingRight: '20px' , }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div style={{ paddingRight: '20px' , }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div style={{ paddingRight: '20px' , }}>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
						<div>
							<img height={100} src="https://i.imgur.com/xkH6wCg.png" />
						</div>
					</Row>
				</CardContainer>
			</StyledCenteredContainer>
		</>
	);
};

export default AccountPage;