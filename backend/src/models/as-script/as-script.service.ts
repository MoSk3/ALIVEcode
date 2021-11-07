import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CompileDTO } from './dto/compile.dto';
import axios from 'axios';

@Injectable()
export class AsScriptService {
  async sendDataToAsServer(data: any) {
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
    console.log(res);
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
