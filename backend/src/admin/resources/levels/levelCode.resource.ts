import { ResourceWithOptions } from 'adminjs';
import { levelParent } from './level.parent';
import { LevelCodeEntity } from '../../../models/level/entities/levelCode.entity';

const LevelCodeResource: ResourceWithOptions = {
  resource: LevelCodeEntity,
  options: { parent: levelParent },
};

export default LevelCodeResource;