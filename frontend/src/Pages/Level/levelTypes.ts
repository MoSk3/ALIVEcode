import { Level } from "../../Models/Level/level.entity";

export interface LevelProps {
	editMode: boolean;
	type?: 'ALIVE' | 'code' | 'AI' | 'IoT';
	level?: Level;
}
