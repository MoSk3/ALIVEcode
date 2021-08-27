import { Injectable } from '@nestjs/common';

@Injectable()
export class AsScriptService {
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
