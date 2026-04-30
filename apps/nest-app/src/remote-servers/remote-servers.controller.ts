import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RemoteServersService } from './remote-servers.service';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import { UpdateRemoteServerDto } from './dto/update-remote-server.dto';
import { currentUser } from '../auth/current-user.decorator';
import type { ICurrentUser } from '../auth/current-user.interface';

@Controller('remote-servers')
export class RemoteServersController {
  constructor(private readonly remoteServersService: RemoteServersService) {}

  @Post()
  create(
    @Body() createRemoteServerDto: CreateRemoteServerDto,
    @currentUser() user: ICurrentUser,
  ) {
    console.log(user);
    return this.remoteServersService.create(createRemoteServerDto, user.id);
  }

  @Get()
  findAll(@currentUser() currentUser: ICurrentUser) {
    return this.remoteServersService.findAll(currentUser.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @currentUser() currentUser: ICurrentUser) {
    return this.remoteServersService.getbyId(id, currentUser.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRemoteServerDto: UpdateRemoteServerDto,
    @currentUser() currentUser: ICurrentUser,
  ) {
    return this.remoteServersService.update(
      id,
      updateRemoteServerDto,
      currentUser.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @currentUser() currentUser: ICurrentUser) {
    return this.remoteServersService.remove(id, currentUser.id);
  }
}
