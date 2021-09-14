import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { compare } from 'bcryptjs';

export const adminCredentialValidator = {
  inject: [getRepositoryToken(UserEntity)], // injects the User repository in the factory
  useFactory: (userRepository: Repository<UserEntity>) => {
    // You can now return a function to validate the credentials
    return async function validateCredentials(email: string, password: string) {
      const user: UserEntity | null = await userRepository.findOne({ email });

      if (user && user.isAdmin && compare(password, user.password)) {
        return user;
      }
      return null; // The credentials do not identify an administor
    };
  },
};