import { applyDecorators } from "@nestjs/common";
import { Groups, GroupsTransformer } from '../metadata/groupsTransformer.metadata';

export const Group = (...groups: Array<Groups>) => {
  return applyDecorators(GroupsTransformer(...groups));
};