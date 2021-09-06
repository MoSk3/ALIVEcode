import { Level } from "../../../Models/Level/level.entity";
import { LevelAlive } from '../../../Models/Level/levelAlive.entity';
import { LevelCode } from '../../../Models/Level/levelCode.entity';
import styled from 'styled-components';

export type LevelCardProps = {
	level: LevelAlive | LevelCode | Level;
	enterEdit?: boolean;
};

export const StyledLevelCard = styled.div`
	background-color: var(--primary-color);
	margin: 10px;
	border-radius: 10px;
	cursor: pointer;
	transition: 0.2s;

	&:hover {
		background-color: var(--contrast-color);
	}

	.content {
		padding: 20px;
	}
`;
