import { Level } from './level.entity';

export enum LEVEL_RESOLUTION_MODE {
	ANY = 'ANY',
}

export class LevelCode extends Level {
	resolution: LEVEL_RESOLUTION_MODE;
	initialCode?: string;
	testCases: string;
	solution?: string;
}