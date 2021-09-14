import { AdminAuthModuleFactory, AdminCoreModuleFactory } from 'nestjs-admin'
import { Module } from '@nestjs/common';
import { adminCredentialValidator } from './credentialsValidator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';

const CoreModule = AdminCoreModuleFactory.createAdminCoreModule({});
const AuthModule = AdminAuthModuleFactory.createAdminAuthModule({
  adminCoreModule: CoreModule, // what admin module are you configuring authentication for
  credentialValidator: adminCredentialValidator, // how do you validate credentials
  imports: [TypeOrmModule.forFeature([UserEntity])], // what modules export the dependencies of the credentialValidator available
  providers: [], // additional providers that will be instanciated and exported by the AdminAuthModuleFactory
});

@Module({
  imports: [CoreModule, AuthModule],
  exports: [CoreModule],
})
export class AdminModule {}