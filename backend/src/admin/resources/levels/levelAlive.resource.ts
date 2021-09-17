import { ResourceWithOptions } from 'adminjs';
import { levelParent } from './level.parent';
import { LevelAliveEntity } from '../../../models/level/entities/levelAlive.entity';

const LevelAliveResource: ResourceWithOptions = {
  resource: LevelAliveEntity,
  options: { parent: levelParent },
};

export default LevelAliveResource;