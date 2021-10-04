import { Transform, Type, plainToClass } from 'class-transformer';
import { Level } from '../Level/level.entity';
import { LevelAI } from '../Level/levelAI.entity';
import { LevelAlive } from '../Level/levelAlive.entity';
import { LevelCode } from '../Level/levelCode.entity';
import { Activity } from './activity.entity';

export class ActivityLevel {
	id: number;

	mustBeCompleted: boolean;

	@Type(() => Activity)
	activity?: Activity;

	@Transform(({ value: level }) => {
		if (level.layout) return plainToClass(LevelAlive, level);
		if (level.testCases) return plainToClass(LevelCode, level);
		if (level.ai) return plainToClass(LevelAI, level);
		return plainToClass(Level, level);
	})
	level: Level;
}