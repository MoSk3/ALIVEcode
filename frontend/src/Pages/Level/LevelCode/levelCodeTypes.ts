import { LevelCode } from '../../../Models/Level/levelCode.entity';
import { LevelProgression } from '../../../Models/Level/levelProgression';

export interface LevelCodeProps {
	level: LevelCode;
	editMode: boolean;
	progression: LevelProgression;
	setProgression: (progression: LevelProgression) => void;
}