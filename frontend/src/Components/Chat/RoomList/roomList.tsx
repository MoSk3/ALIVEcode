import { useContext, useEffect, useState } from "react";
import { Card, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import './roomlist.css';
import { UserContext } from '../../../state/contexts/UserContext';
import api from '../../../Models/api';
import { Topics } from '../../../Models/Social/topics.entity';

const RoomList = ({ setActiveTopic }: any) => {
	const [topics, setTopics] = useState<Topics[]>([]);
	const [active, setActive] = useState(0);
	const { user } = useContext(UserContext);

	useEffect(() => {
		async function getTopics() {
			const resultTopics = await api.db.topics.all({});
			console.log(resultTopics);
			setTopics(resultTopics);
			setActiveTopic(resultTopics[0].name);
		}
		getTopics();
	}, [user]);
	console.log();
	return (
		<div className="text-left col-sm-3">
			<Card style={{ height: '100%' }}>
				<Row
					className="justify-content-md-center"
					style={{ paddingTop: '1rem', height: '100px' }}
				>
					<img
						className="message-image "
						style={{ width: '100px', maxHeight: '100px' }}
						alt="imageUser"
						src={`http://localhost:8000/uploads/${user?.getDisplayImage()}`}
					/>
				</Row>
				<Row className="justify-content-md-center">
					<h3>{user?.getDisplayName()}</h3>
				</Row>{' '}
				<DropdownButton
					id="dropdown-button-drop-end"
					drop="right"
					variant="secondary"
					title={` Drop end `}
				>
					<Dropdown.Item eventKey="1">Action</Dropdown.Item>
					<Dropdown.Item eventKey="2">Another action</Dropdown.Item>
					<Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
				</DropdownButton>
				{topics.map((topic, idx) => {
					return (
						<div className="list-group">
							<div
								className={`list-group-item list-group-item-action ${
									topic.id === active ? 'active' : ''
								}`}
								key={idx}
								onClick={() => {
									setActiveTopic(topic.name);
									setActive(topic.id);
								}}
							>
								{topic.name}
							</div>
						</div>
					);
				})}
			</Card>
		</div>
	);
};
export default RoomList;

{
	/* 
	return (
		<div className="text-left col-sm-3">
			<Card style={{ height: '100%' }}>
				<Row
					className="justify-content-md-center"
					style={{ paddingTop: '1rem', height: '100px' }}
				>
					<img
						className="message-image "
						style={{ width: '100px', maxHeight: '100px' }}
						src={`http://localhost:8000/uploads/${user?.getDisplayImage()}`}
					/>
				</Row>
				<Row className="justify-content-md-center">
					<h3>{user?.getDisplayName()}</h3>
				</Row>{' '}
				<DropdownButton
					id="dropdown-button-drop-end"
					drop="right"
					variant="secondary"
					title={` Drop end `}
				>
					<Dropdown.Item eventKey="1">Action</Dropdown.Item>
					<Dropdown.Item eventKey="2">Another action</Dropdown.Item>
					<Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
				</DropdownButton>
				{topics.map((topic, idx) => {
					return (
						<div className="list-group">
							<div
								className="list-group-item list-group-item-action"
								onClick={() => setActiveTopic(topic)}
							>
								{topic}
							</div>
						</div>
					);
				})}
			</Card>
		</div>
	);
	
	
	<OffCanvas
					width={300}
					transitionDuration={300}
					effect={'overlay'}
					isMenuOpened={isMenuOpened}
					position={'left'}
				>
					<OffCanvasBody style={{ fontSize: '30px', height: '300px' }}>
						<Button variant="primary" onClick={handleClick}>
							OffCanvas
						</Button>
					</OffCanvasBody>
					<OffCanvasMenu
						style={{ fontSize: '30px', top: '300px', left: '50px' }}
					>
						<Card className="menu">
							<p>Placeholder content.</p>
							<ul>
								<li>Link 1</li>
								<li>Link 2</li>
								<li>Link 3</li>
								<li>Link 4</li>
								<li>Link 5</li>
								<li>
									<a href="#" onClick={() => handleClick()}>
										Toggle Menu
									</a>
								</li>
							</ul>
						</Card>
					</OffCanvasMenu>
				</OffCanvas> */
}