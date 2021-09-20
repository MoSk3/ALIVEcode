import { SetMetadata } from "@nestjs/common";

export type Groups = 'admin' | 'user';

export const GroupsTransformer = (...groups: Array<Groups>) => SetMetadata('groups', groups);