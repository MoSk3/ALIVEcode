import { Response } from "express";
import { sign } from "jsonwebtoken"
import { Role } from 'src/utils/types/roles.types';
import { ProfessorEntity } from './entities/professor.entity';
import { StudentEntity } from './entities/student.entity';
import { UserEntity } from './entities/user.entity';

// TODO: Add secret key
export const createAccessToken = (user: UserEntity) => {
  return sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_DURATION },
  );
};

export const createRefreshToken = (user: UserEntity) => {
  return sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_DURATION },
  );
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie('wif', token, {
    httpOnly: true,
  });
};

export const hasRole = (user: UserEntity, ...roles: Array<Role>): boolean => {
  if (roles.length === 0) return true;
  return roles.some(role => {
    switch (role) {
      case Role.SUPER_USER:
        return user.is_super_user;
      case Role.ADMIN:
        return user.is_admin || user.is_super_user;
      case Role.MOD:
        return user.is_mod || user.is_admin || user.is_super_user;
      case Role.STAFF:
        return user.is_super_user || user.is_admin || user.is_mod;
      case Role.PROFESSOR:
        return user instanceof ProfessorEntity;
      case Role.STUDENT:
        return user instanceof StudentEntity;
    }
  });
};
