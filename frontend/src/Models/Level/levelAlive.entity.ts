import { Level } from "./level.entity";

export enum LEVEL_RESOLUTION_MODE {
  ANY = 'ANY',
}

export class LevelAlive extends Level {
	layout: string;
	resolution: LEVEL_RESOLUTION_MODE;
	solution?: string;
}
