import { useState, useContext } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import useRoutes from '../../state/hooks/useRoutes';
import Button from '../../Components/UtilsComponents/Button/Button';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useHistory } from 'react-router';
import { StyledLevelBrowse } from '../Level/LevelBrowse/levelBrowseTypes';

const Forum = () => {
	const { routes } = useRoutes();
	const history = useHistory();

	return (
		<div>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"/>

            <CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
			<div>
			<nav className="navbar" role="navigation" aria-label="main navigation">
				<div className="navbar-start">
					<a className="navbar-item" href="https://bulma.io/">
						Forum
					</a>
					<a className="navbar-item" href="https://bulma.io/">
						Chat
					</a>
					<a className="navbar-item" href="https://bulma.io/">
						Alive
					</a>
				</div>
				<div className="navbar-end">
					<input className="input" type="text" name="SearchBar" value="Search"/>
				</div>
			</nav>
			</div>
			<div className="has-text-left ml-5">
				Home
			</div>

			<div className="columns">
				<div className="column is-8">
					<CardContainer asRow title="Forums">
							<div className="has-text-left ml-3">
							Règles<br/>
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
							</div>
					</CardContainer>
					<CardContainer asRow title="Iot">
						<div className="columns is-vcentered">
							<div className="column is-4">
								<div className="media">
									<div className="media-left">
										<figure className="image is-48x48">
											<img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png"/>
										</figure>
									</div>
									<div className="has-text-left">
										Iot
									</div>
								</div>
							</div>
							<div className="column is-5">
								<div className="has-text-left">
									111 sujets
								</div>
								<div className="has-text-left">
									2322 messages
								</div>
							</div>
							<div className="column is-5 is-offset-6">
								<div className="has-text-left">
									date dernier post
								</div>
							</div>
						</div>
					</CardContainer>

					<CardContainer asRow title="Prog">
						<div>
							<div className="columns">
								<div className="column">
									<div className="media">
										<div className="media-left">
											<figure className="image is-48x48">
												<img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png"/>
											</figure>
										</div>
										<div className="has-text-left">
											Javascript
										</div>
									</div>
								</div>
								<div className="column is-5">
									<div className="has-text-left">
										111 sujets
									</div>
									<div className="has-text-left">
										2322 messages
									</div>
								</div>
								<div className="column is-5 is-offset-6">
								<div className="has-text-left">
									date dernier post
								</div>
							</div>
							</div>
						</div>
					</CardContainer>
				</div>
				
				<div className="column">
					<div className="column pt-6">
						<button className="button is-medium is-fullwidth">Créer un sujet</button>
						<CardContainer asRow title="Derniers sujets">
							<div>
							<div className="card">
								<div className="card-content">
									<div className="media">
									<div className="media-left">
										<figure className="image is-48x48">
										<img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image"/>
										</figure>
									</div>
									<div className="media-content">
										<p className="title is-6">John Smith</p>
									</div>
									</div>
								</div>
								<div className="content ml-2">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Phasellus nec iaculis mauris
									<br/>
									<time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
								</div>
							</div>
							</div>
						</CardContainer>
					</div>
				</div>
			</div>	
            </CenteredContainer>
		</div>
	);
};

export default Forum;