import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CompileDTO } from './dto/compile.dto';
import axios from 'axios';
import LevelIoTBackendExecutor from './LevelIoTBackendExecutor';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';

@Injectable()
export class AsScriptService {
  constructor(private iotProjectService: IoTProjectService) {}

  async sendDataToAsServer(data: any) {
    data.context = {
      test: 'yes',
    };
    let res: AxiosResponse;
    try {
      res = await axios({
        method: 'POST',
        url: '/compile/',
        baseURL: process.env.AS_URL,
        data,
      });
    } catch {
      throw new HttpException('AliveScript service crashed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return res.data;
  }

  async compile(compileDto: CompileDTO) {
    const { backendCompiling, ...data } = compileDto;

    if (backendCompiling) return await this.compileBackend(data);

    return await this.sendDataToAsServer(data);
  }

  async compileBackend(data: any) {
    const res = await this.sendDataToAsServer(data);
    const executor = new LevelIoTBackendExecutor(this, this.iotProjectService, res.result);
    await executor.toggleExecution();

    if (res.result) {
      const index = res.result.findIndex((action: any) => action.id === 0);
      res.result.splice(index >= 0 ? index : res.result.length, 0, ...executor.getActionsResponse());
    }
    return res;
  }

  findAll() {
    return `This action returns all asScript`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asScript`;
  }

  remove(id: number) {
    return `This action removes a #${id} asScript`;
  }
}
