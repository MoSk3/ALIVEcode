import { Classroom } from "../../../Models/Classroom/classroom.entity";
import styled from 'styled-components';

export type ClassroomHeaderProps = {
	classroom: Classroom;
};

export const StyledClassroomHeader = styled.div`
	color: white;
	background-color: var(--primary-color);
	width: 100%;
	padding: 50px;

	span {
		margin-top: 10px;
		font-size: 20px;
		background-color: var(--secondary-color);
	}

	.classroom-title-name {
		font-size: 2.3em;
		margin-bottom: 0;
	}

	.classroom-title-desc {
		font-size: 1.3em;
		margin-bottom: 0;
	}

	.classroom-buttons {
		text-align: right;
	}

	.classroom-buttons button {
		margin: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	@media screen and (max-width: 991px) {
		.classroom-title {
			text-align: center;
		}

		.classroom-buttons {
			margin-top: 15px;
			text-align: center;
		}

		.classroom-courses {
			margin-top: 50px;
		}

		.classroom-students-body {
			height: calc(50vh - 110px);
		}

		.classroom-courses-body {
			height: calc(55vh - 110px);
		}
	}
`;
