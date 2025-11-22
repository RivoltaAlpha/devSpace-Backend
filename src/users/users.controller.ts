import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth('access-token')// endpoints require Authentication
@ApiTags('Users') // grouping 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.Admin)
  @Get('get-all')
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.Admin)
  @Get('get-user/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Roles(UserRole.Admin)
  @Patch('update-user/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(UserRole.Admin)
  @Delete('delete-user/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
