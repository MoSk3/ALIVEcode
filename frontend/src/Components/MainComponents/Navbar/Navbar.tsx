import { useContext } from 'react';
import { NavbarProps } from './NavbarTypes';
import { UserContext } from '../../../UserContext';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import './navbar.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Logo from '../../../assets/images/LogoALIVE.png';

const ALIVENavbar = ({ handleLogout }: NavbarProps) => {
	const { user } = useContext(UserContext);
	const history = useHistory();

	return (
		<Navbar id="navbar" bg="light" expand="lg">
			<Navbar.Brand>
				<Link to="/">
					<img src={Logo} alt="" width="100" height="30" className="d-inline-block align-top"></img>
				</Link>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link className="nav-link" onClick={() => history.push('/dashboard')} >Dashboard</Nav.Link>
					<Nav.Link className="nav-link" onClick={() => history.push('/aliveia')} >ALIVE IA</Nav.Link>
					<Nav.Link className="nav-link" onClick={() => history.push('/mind')} >ALIVE Mind Controller</Nav.Link>
					<Nav.Link className="nav-link" onClick={() => history.push('/about')} >À propos</Nav.Link>
				</Nav>
				{user ? (
					<label style={{marginBottom: '0'}} className="nav-link">
						Bonjour, {user.getDisplayName()}
					</label>
				) : (
					<label className="nav-link">Vous n'êtes pas connecté, <Link to={'/signin'}>se
						connecter?
					</Link>
					</label>
				)}
				<div className="d-flex flex-row order-2 order-lg-3">
					<ul className="navbar-nav flex-row">
						<li className="nav-item">
							<div id="user" className="dropdown">
								<NavDropdown title={
									<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
										viewBox="0 0 600 600" stroke="#0178bc" strokeWidth="30" fill="none">

										<title>Abstract user icon</title>

										<circle cx="300" cy="300" r="265" />
										<circle cx="300" cy="230" r="115" />
										<path d="M106.81863443903,481.4 a205,205 1 0,1 386.36273112194,0" strokeLinecap="butt" />
									</svg>
								} id="basic-nav-dropdown">
									{user ? (
										<NavDropdown.Item onClick={handleLogout}>Se déconnecter</NavDropdown.Item>
									) : (
										<>
											<NavDropdown.Item onClick={() => history.push('/signin')}>Se connecter</NavDropdown.Item>
											<NavDropdown.Item onClick={() => history.push('/signup')}>S'inscrire</NavDropdown.Item>
										</>
									)}
								</NavDropdown>
							</div>
						</li>

					</ul>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown">
						<span className="navbar-toggler-icon"></span>
					</button>
				</div>
			</Navbar.Collapse>
		</Navbar>



	)
}

export default ALIVENavbar;