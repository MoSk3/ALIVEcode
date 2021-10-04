import { Level } from "../../Models/Level/level.entity";

export interface LevelProps {
	editMode: boolean;
	type?: 'ALIVE' | 'code' | 'ai' | 'IoT';
	level?: Level;
}
