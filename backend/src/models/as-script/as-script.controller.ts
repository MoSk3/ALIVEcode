import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsScriptService } from './as-script.service';

@Controller('as-script')
export class AsScriptController {
  constructor(private readonly asScriptService: AsScriptService) {}

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
