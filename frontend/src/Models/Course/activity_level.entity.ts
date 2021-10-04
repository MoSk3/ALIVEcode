import { Transform, Type, plainToClass } from 'class-transformer';
import { Level } from '../Level/level.entity';
import { LevelAlive } from '../Level/levelAlive.entity';
import { LevelCode } from '../Level/levelCode.entity';
import { Activity } from './activity.entity';

export class ActivityLevel {
	id: number;

	mustBeCompleted: boolean;

	@Type(() => Activity)
	activity?: Activity;

	@Type(() => Level)
	@Transform(({ value: level }) => {
		if (level.layout) return plainToClass(LevelAlive, level);
		else if (level.testCases) return plainToClass(LevelCode, level);
		return plainToClass(Level, level);
	})
	level: Level;
}