import { BadRequestException, Controller, Post, Get, Put, Delete, Param, UseGuards, Req, Query, UseInterceptors, UploadedFiles, Res, NotFoundException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { isNull } from 'src/utils/helper';
import { FileAttachService } from './file-attach.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Upload } from 'src/utils/file-upload';

@Controller('file-attach')
export class FileAttachController {
	constructor(private readonly service: FileAttachService) { }

	@UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, Upload))
  async uploadFile(@Req() req, @UploadedFiles() files: Array<any>) {
    const maxSize = 50 * 1024 * 1024;
    files.forEach(file => {
      if (file.size > maxSize) {
        throw new BadRequestException('File too large');
      }
    });
    return await this.service.createFile(req.query, req.user, files);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  put(@Req() req): any {
    return this.service.put(req)
  }

  @Get()
  async getFiles(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.getFiles({ limit, page }, search)
  }

  @Get('list')
  async getList(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.getList({ limit, page }, search)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getFile(@Param('id') id: number, @Res() res) {
    const file: any = await this.service.getFile(id)
    if (!file || isNull(process.env.FILE_PATH)) {
      throw new NotFoundException('Файл олдсонгүй')
    }
    return res.sendFile(file.fileSystemName, { root: process.env.FILE_PATH })
  }

  @UseGuards(JwtAuthGuard)
	@Delete(':id')
	async removeFile(@Param('id') id: number) {
		return await this.service.removeFile(id)
	}
}
