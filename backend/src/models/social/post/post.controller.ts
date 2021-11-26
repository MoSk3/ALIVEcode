import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Post as PostEntity } from './entities/post.entity';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth()
  async create(@User() user: UserEntity, @Body() createPostDto: PostEntity) {
    console.log(createPostDto)
    return await this.postService.create(user, createPostDto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('lastPost')
  getLastPost() {
    return this.postService.getLastPost();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
