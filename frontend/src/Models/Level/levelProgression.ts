export type LevelAliveProgressionData = {
  code?: string;
};

export type LevelCodeProgressionData = {
	code?: string;
};

export type LevelProgressionData =
	| LevelAliveProgressionData
	| LevelCodeProgressionData;

export class LevelProgression {
	levelId: string;

	data: LevelProgressionData;
}
