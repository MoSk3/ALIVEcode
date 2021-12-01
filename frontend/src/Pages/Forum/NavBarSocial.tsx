import { Nav, Navbar } from "react-bootstrap";

const NavBarSocial = () => {
    return (
        <Navbar bg="light">
				<Navbar.Brand href="#home">Socialive</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto">
					<Nav.Link href="/forum">Home</Nav.Link>
					<Nav.Link href="/forum/categoriesForum">Catégories</Nav.Link>
				</Nav>
				</Navbar.Collapse>
				
			</Navbar>
    );
};

export default NavBarSocial;