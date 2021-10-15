import Button from '../../Components/UtilsComponents/Button/Button';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';

const Forum = () => {

	return (
		<div>
            <CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
			<div>
			<nav className="navbar  navbar-expand-lg navbar-light bg-light">
				<div className="container-fluid">
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<a className="nav-link" href="#">Forum</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">Chat</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">Alive</a>
							</li>
						</ul>
					</div>
					<form className="d-flex">
        				<input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        				<button className="btn btn-light" type="submit">Recherche</button>
      				</form>
				</div>
			</nav>
			</div>
			<div className="text-left ml-4">
				Home
			</div>

			<div className="row">
				<div className="col-8">
					<CardContainer asRow title="Forum">
							<div className="text-left ml-3">
							Règles<br/>
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
							</div>
					</CardContainer>
					<CardContainer asRow title="Iot">
						<div className="row">
							<div className="col border-right border-dark">
								<div className="media">
									<img className="mr-3 rounded-circle" src="https://bulma.io/images/placeholders/64x64.png" alt=""/>
									<div className="text-left">
										Iot
									</div>
								</div>
							</div>
							<div className="col border-right border-dark">
								<div className="text-left">
									111 sujets
								</div>
								<div className="text-left">
									2322 messages
								</div>
							</div>
							<div className="col">
								<div className="text-left">
									date dernier post
								</div>
							</div>	
						</div>
					</CardContainer>

					<CardContainer asRow title="Programmation">
						<div>
							<div className="row">
								<div className="col border-right border-dark">
								<div className="media">
									<img className="mr-3 rounded-circle" src="https://bulma.io/images/placeholders/64x64.png" alt=""/>
									<div className="text-left">
										Javascript
									</div>
								</div>
							</div>
								<div className="col  border-right border-dark">
									<div className="text-left">
										111 sujets
									</div>
									<div className="text-left">
										2322 messages
									</div>
								</div>
								<div className="col">
								<div className="text-left">
									date dernier post
								</div>
							</div>
							</div>
						</div>
					</CardContainer>
				</div>
				
				<div className="col">
					<div className="col">
						<Button variant={'primary'} className="btn-lg mt-5">Créer un sujet</Button>
						<CardContainer asRow title="Derniers sujets">
							<div>
							<div className="card ml-2 mr-2">
								<div className="card-content">
									<div className="media">
										<img className="rounded-circle mr-3" src="https://bulma.io/images/placeholders/64x64.png" alt=""/>
										<div className="card-title">John Smith</div>
									</div>
								</div>
								<div className="card-text ml-2">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Phasellus nec iaculis mauris
									<br/>
									<p className="card-text"><small className="text-muted">11:09 PM - 1 Jan 2016</small></p>
								
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