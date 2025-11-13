import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const port = process.env.PORT ?? 3000;
    const baseUrl = `http://localhost:${port}`;
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;
    return { url: fileUrl };
  }
}
