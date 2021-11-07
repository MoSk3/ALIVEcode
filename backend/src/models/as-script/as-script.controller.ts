import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AsScriptService } from './as-script.service';
import { CompileDTO } from './dto/compile.dto';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';

export interface Datatype {
  nul: string;
  entier: string;
  texte: string;
  decimal: string;
  booleen: string;
}

export interface LinterFormatType {
  blocs: string[];
  datatype: Datatype;
  logiques: string[];
  operators: string[];
  fonctions: string[];
  variable: string;
  datatypes_names: string[];
  fin: string;
  fonctions_builtin: string[];
  control_flow: string[];
  const: string;
  modules: string[];
  commands: string[];
}
@Controller('as')
@UseInterceptors(DTOInterceptor)
export class AsScriptController {
  constructor(private readonly asScriptService: AsScriptService) {}

  @Post('compile')
  async compile(@Body() compileDto: CompileDTO) {
    let res: AxiosResponse;
    try {
      res = await axios({
        method: 'POST',
        url: '/compile/',
        baseURL: process.env.AS_URL,
        data: compileDto,
      });
    } catch {
      throw new HttpException('AliveScript service crashed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const { data } = res;
    return data;
  }

  @Get('lintinfo')
  async getLintInfo() {
    const lintInfo: LinterFormatType = await (
      await axios({
        method: 'GET',
        url: '/lintinfo/',
        baseURL: process.env.AS_URL,
      })
    ).data;
    return lintInfo;
  }

  @Post()
  create(@Body() createAsScriptDto: any) {
    return; //this.asScriptService.create(createAsScriptDto);
  }

  @Get()
  findAll() {
    return this.asScriptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asScriptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsScriptDto: any) {
    return; //this.asScriptService.update(+id, updateAsScriptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asScriptService.remove(+id);
  }
}
