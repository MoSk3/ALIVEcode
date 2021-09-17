import { ResourceWithOptions } from 'adminjs';
import { LevelEntity } from '../../../models/level/entities/level.entity';
import { levelParent } from './level.parent';

const LevelResource: ResourceWithOptions = {
  resource: LevelEntity,
  options: { parent: levelParent },
};

export default LevelResource;