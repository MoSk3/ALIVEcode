import { Injectable } from '@nestjs/common';
import { CreateAsScriptDto } from './dto/create-as-script.dto';
import { UpdateAsScriptDto } from './dto/update-as-script.dto';

@Injectable()
export class AsScriptService {
  create(createAsScriptDto: CreateAsScriptDto) {
    return 'This action adds a new asScript';
  }

  findAll() {
    return `This action returns all asScript`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asScript`;
  }

  update(id: number, updateAsScriptDto: UpdateAsScriptDto) {
    return `This action updates a #${id} asScript`;
  }

  remove(id: number) {
    return `This action removes a #${id} asScript`;
  }
}
