import { LevelAlive } from "../../../Models/Level/levelAlive.entity";
import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';

export interface LevelAliveProps {
	level: LevelAlive;
	editMode: boolean;
}

type StyledProps = {
	editMode: boolean;
};

export const StyledAliveLevel = styled(FillContainer)`
	overflow-y: hidden;

	.row {
		padding: 0;
		margin: 0;
	}

	.left-col {
		padding: 0;
		display: flex;
		flex-flow: column;
	}

	.tools-bar {
		display: flex;
		align-items: center;
		background-color: var(--primary-color);
		border: none;
		padding: 5px;
	}

	.level-title {
		color: var(--foreground-color);
		padding: 0px 10px 0px 10px;
		${({ editMode }: StyledProps) => editMode && 'cursor: pointer'};
		margin-bottom: 0;
		font-size: 1.2em;
	}

	.save-message {
		color: rgba(var(--foreground-color), 0.8);
		margin-bottom: 0;
	}

	.icon-button {
		margin: 0px 3px 0px 3px;
	}
`;