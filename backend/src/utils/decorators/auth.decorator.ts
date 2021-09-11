import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from '../types/roles.types';
import { RolesGuard } from '../guards/auth.guard';
import { Roles } from '../metadata/roles.metadata';

export const Auth = (...roles: Array<Role>) => {
  return applyDecorators(Roles(...roles), UseGuards(RolesGuard));
};