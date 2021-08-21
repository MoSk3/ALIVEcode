import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsScriptService } from './as-script.service';
import { CreateAsScriptDto } from './dto/create-as-script.dto';
import { UpdateAsScriptDto } from './dto/update-as-script.dto';

@Controller('as-script')
export class AsScriptController {
  constructor(private readonly asScriptService: AsScriptService) {}

  @Post()
  create(@Body() createAsScriptDto: CreateAsScriptDto) {
    return this.asScriptService.create(createAsScriptDto);
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
  update(@Param('id') id: string, @Body() updateAsScriptDto: UpdateAsScriptDto) {
    return this.asScriptService.update(+id, updateAsScriptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asScriptService.remove(+id);
  }
}
