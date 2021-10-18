import { Level } from "../../Models/Level/level.entity";

export interface LevelProps {
	editMode: boolean;
	type?: 'ALIVE' | 'code' | 'AI' | 'IoT';
	level?: Level;
}

export type typeAskForUserInput = (
	msg: string,
	callback: (inputValue: string) => void,
) => void;