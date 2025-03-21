import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CreateJwtDto } from './dto/create-jwt.dto';
import { UpdateJwtDto } from './dto/update-jwt.dto';

@Controller('jwt')
export class JwtController {
  constructor(private readonly jwtService: JwtService) {}

  @Post()
  create(@Body() createJwtDto: CreateJwtDto) {
    return this.jwtService.create(createJwtDto);
  }

  @Get()
  findAll() {
    return this.jwtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jwtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJwtDto: UpdateJwtDto) {
    return this.jwtService.update(+id, updateJwtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jwtService.remove(+id);
  }
}
