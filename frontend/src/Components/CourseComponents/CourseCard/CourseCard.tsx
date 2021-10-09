import { CourseCardProps } from './courseCardTypes';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '../../DashboardComponents/IconButton/IconButton';

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

/**
 * Card that shows all the information of a classroom and lets you access to it
 *
 * @param {Classroom} classroom classroom object
 *
 * @author MoSk3
 */
const CourseCard = ({ course }: CourseCardProps) => {
	const { user } = useContext(UserContext);
	const history = useHistory();

	return (
		<div>
			<div className="card-front text-white">
				<div className="card-body">
					<h4>{course.name}</h4>
					<FontAwesomeIcon icon={faAngleRight} size="5x" />
				</div>
			</div>
			<div className="card-back">
				<div className="card-body">
					{course.creator.getDisplayName()}
					{user?.isStudent() && (
						<h6 className="card-subtitle mb-2 text-muted">
							Made by {course.creator.getDisplayName()}
						</h6>
					)}
					<span className="card-subtitle badge badge-primary">Matière</span>
					<p>{course.getSubjectDisplay()}</p>
					<span className="card-subtitle badge badge-primary">Description</span>
					<p className="card-text">
						{course.description
							? `${course.description}`
							: `Course of ${course.getSubjectDisplay()}`}
					</p>
					<IconButton
						onClick={() => history.push(`/course/${course.id}`)}
						icon={faAngleRight}
						size="4x"
						width={100}
					/>
				</div>
			</div>
		</div>
	);
};

export default CourseCard;