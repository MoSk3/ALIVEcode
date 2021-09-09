import { Module } from '@nestjs/common';
import { AsScriptService } from './as-script.service';
import { AsScriptController } from './as-script.controller';

@Module({
  controllers: [AsScriptController],
  providers: [AsScriptService]
})
export class AsScriptModule {}
