import { DashboardProps } from './dashboardTypes';
import CenteredContainer from '../../Components/MiscComponents/CenteredContainer/CenteredContainer';
import LabelHighlight from '../../Components/MiscComponents/LabelHighlight/LabelHighlight';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import CardContainer from '../../Components/MainComponents/CardContainer/CardContainer';
import { useHistory } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ClassroomCard from '../../Components/DashboardComponents/ClassroomCard/ClassroomCard';
import { Classroom } from '../../Models/Playground/Classroom';
import SmallCard from '../../Components/MainComponents/SmallCard/SmallCard';
import { Database } from '../../Models/Model';

const Dashboard = (props: DashboardProps) => {
	const { user } = useContext(UserContext);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [classrooms, setClassrooms] = useState<Array<Classroom>>();

	useEffect(() => {
		const getClassrooms = async () => {
			setClassrooms(await Database.playground.classrooms.ofCurrentUser);
		}
		getClassrooms();
	}, [user])

	const history = useHistory();

	return (
		<CenteredContainer horizontally textAlign="center">
			<LabelHighlight
				text={`Bonjour, ${user?.getDisplayName()}`}
				textColor="white"
				padding="25px"
				borderRadius="25px"
				fontSize="45px"
			/>
			<CardContainer
				title="Mes classes"
				style={{ marginTop: '20px' }}
				onIconClick={() => history.push('/playground/join-classroom')}
				icon={faPlus}
			>
				{classrooms === undefined ? (
					"Loading..."
				) : (
					classrooms.map((classroom, idx) => (
						<ClassroomCard key={idx} classroom={classroom} />
					))
				)}
			</CardContainer>
			<CardContainer
				title="Niveaux"
			>
				<SmallCard>
						test
				</SmallCard>
			</CardContainer>
		</CenteredContainer>
	)
}

export default Dashboard;

/*

{% include "base.html" %}
{% load static %}
{% load profile %}
<link rel="stylesheet" type="text/css" href="{% static 'css/dashboard.css' %}">
<link rel="stylesheet" type="text/css" href="{% static 'css/maisonneuve_background.css' %}">
<link rel="stylesheet" type="text/css" href="{% static 'css/challenge.css' %}" />

<div id='main-div' class="container-fluid">
		<div class="row row-bonjour justify-content-center" style="text-align: center;">
				<div class="col-10">
						<h1>
								Bonjour
								{% if user|isProfessor %}
								{{ user.professor.first_name }}
								{% else %}
								{{ user.student.name }}
								{% endif %}
						</h1>
				</div>
		</div>


		<div class="dashboard-sub-header">
				<div>
						<h1>Mes classes <button id="add-button" onclick="window.location='{% url 'home:join_classroom' %}'"><i
												class="fas fa-plus"></i></h1>
				</div>
				<div class="mes-classes-body container-fluid">
						<div class="scrolling-wrapper row flex-row flex-nowrap mt-4 pb-4 pt-2">

								{% if classrooms|length == 0%}
								<p style="font-size: 18px; margin: auto;">
										Tu ne fais pas partie de aucune classe, <a href="{% url 'home:join_classroom' %}">rejoindre une
												classe?</a>
								</p>
								{% else %}
								{% for classroom in classrooms %}

								<div class="col-sm">
										{% include "modules/classroom_card.html" %}
								</div>
								{% endfor %}
								{% endif %}
						</div>
				</div>
		</div>


		<div class="dashboard-sub-header" style="padding-bottom: 50px;">
				<div>
						<h1>Niveaux</h1>
				</div>
				<div class="niveaux-body container-fluid">
						<div id="buttons" class="row justify-content-center">
								<div>
										<div id="button1" class="menu-button" onclick='location.href="{% url "home:challenges" %}"'>
												<div class="padded-button">
														<div class="logo-button">
																<div style='background-image: url(" {% static "images/icons/my_levels.png" %} ");'>
																</div>
														</div>
														<div class="text-button">
																<div>Mes niveaux</div>
														</div>
												</div>
										</div>
								</div>
								<div>
										<div id="button1" class="menu-button" onclick='location.href="{% url "home:create_challenge" %}"'>
												<div class="padded-button">
														<div class="logo-button">
																<div style='background-image: url(" {% static "images/icons/sandboxblanc.png" %} ");'>
																</div>
														</div>
														<div class="text-button">
																<div>Créer un niveau!</div>
														</div>
												</div>
										</div>
								</div>
								<div>
										<div id="button1" class="menu-button" onclick='location.href="{% url "home:public_challenges" %}"'>
												<div class="padded-button">
														<div class="logo-button">
																<div style='background-image: url(" {% static "images/Voiture.gif" %} ");'></div>
														</div>
														<div class=" text-button">
																<div>Jouer un niveau!</div>
														</div>
												</div>
										</div>
								</div>
						</div>
				</div>
		</div>
		<div class="dashboard-sub-header" style="padding-bottom: 50px;">
				<div>
						<h1>Quiz</h1>
				</div>
				<div class="niveaux-body container-fluid">
						<div id="buttons" class="row justify-content-center">
								<div>
										<div id="button1" class="menu-button" onclick='location.href="/playground/mes_quiz"'>
												<div class="padded-button">
														<div class="logo-button">
																<div style='background-image: url(" {% static "images/icons/my_levels.png" %} ");'>
																</div>
														</div>
														<div class=" text-button">
																<div>Mes quiz!</div>
														</div>
												</div>
										</div>
								</div>
								<div>
										<div id="button1" class="menu-button" onclick='location.href="{% url "playground:newQuiz" %}"'>
												<div class="padded-button">
														<div class="logo-button">
																<div style='background-image: url(" {% static "images/icons/sandboxblanc.png" %} ");'>
																</div>
														</div>
														<div class="text-button">
																<div>Créer un quiz!</div>
														</div>
												</div>
										</div>
								</div>
								<div>
										<div id="button1" class="menu-button" onclick='location.href="{% url "playground:quizChoices" %}"'>
												<div class="padded-button">
														<div class="logo-button">
																<div style='background-image: url(" {% static "images/icons/puzzle.png" %} ");'></div>
														</div>
														<div class=" text-button">
																<div>Quiz!</div>
														</div>
												</div>
										</div>
								</div>
						</div>
				</div>
		</div>
</div>

*/