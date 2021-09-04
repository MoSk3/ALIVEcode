import { ClassRoomCardProps } from './classroomCardTypes';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { useHistory } from 'react-router-dom';
import IconButton from '../IconButton/IconButton';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDiv = styled.div`
	margin: auto;
	border-radius: 25px;
	width: 25em;
	height: 20em;

	&:nth-child(even):hover {
		/*
      transform: rotate(-2deg) scale(1.03) !important;
      */
		cursor: pointer;
	}

	&:nth-child(odd):hover {
		/*
      transform: rotate(2deg) scale(1.03) !important;
      */
		cursor: pointer;
	}

	h1 {
		margin-bottom: 0;
	}

	.card-body button:hover {
		background-color: var(--contrast-color);
	}

	& > div {
		backface-visibility: hidden;
		transition: transform 300ms;
		transition-timing-function: linear;
		width: 100%;
		height: 100%;
		display: flex;
	}

	.card-front {
		border-radius: 25px;
		transform: rotateY(0deg);
		background-color: var(--third-color);
	}

	.card-front:hover {
		background-color: var(--contrast-color);
	}

	.card-back {
		border-radius: 25px;
		transform: rotateY(180deg);
		position: absolute;
		top: 0;
	}

	.hoverfront .card-front {
		transform: rotateY(-180deg);
	}

	.hoverback .card-back {
		transform: rotateY(0deg);
	}

	.clickfront .card-front {
		transform: rotateY(-180deg);
	}

	.clickback .card-back {
		transform: rotateY(0deg);
	}
`;

const ClassroomCard = ({ classroom }: ClassRoomCardProps) => {
	const { user } = useContext(UserContext);
	const history = useHistory();

	return (
		<div>
			<div className="card-front text-white">
				<div className="card-body">
					<h4>{classroom.name}</h4>
					<FontAwesomeIcon icon={faAngleRight} size="5x" />
				</div>
			</div>
			<div className="card-back">
				<div className="card-body">
					{classroom.creator.getDisplayName()}
					{user?.isStudent() && (
						<h6 className="card-subtitle mb-2 text-muted">
							Classe des élèves de {classroom.creator.getDisplayName()}
						</h6>
					)}
					<span className="card-subtitle badge badge-primary">Matière</span>
					<p>{classroom.getSubjectDisplay()}</p>
					<span className="card-subtitle badge badge-primary">Description</span>
					<p className="card-text">
						{classroom.description
							? `${classroom.description}`
							: `Classe de ${classroom.getSubjectDisplay()}`}
					</p>
					<IconButton
						onClick={() => history.push(`/classroom/${classroom.id}`)}
						icon={faAngleRight}
						size="4x"
						width={100}
					/>
				</div>
			</div>
		</div>
	);
};

export default ClassroomCard;