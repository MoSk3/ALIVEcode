import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from '../../../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import { Professor, Student } from '../../../Models/User';

const AccountPage = () => {
	const { user } = useContext(UserContext);

	return (
		<CenteredContainer horizontally vertically textAlign="center">
			{!user ? (
				<FontAwesomeIcon icon={faSpinner} />
			) : (
				<div style={{ padding: '20px' }}>
					<h1>{user.getDisplayName()}</h1>

					{user instanceof Professor && (
						<>
							<label>Nom</label>
							<br />
							<input defaultValue={user.firstName} />
							<br />
							<label>Nom de famille</label>
							<br />
							<input defaultValue={user.lastName} />
							<br />
						</>
					)}
					{user instanceof Student && (
						<>
							<label>Nom</label>
							<input defaultValue={user.name} />
						</>
					)}
				</div>
			)}
		</CenteredContainer>
	);
};

export default AccountPage;