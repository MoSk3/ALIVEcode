import { SetMetadata } from "@nestjs/common";
import { Role } from "../types/roles.types";

export const Roles = (...roles: Array<Role>) => SetMetadata('roles', roles);