import { Injectable, UploadedFile } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async upload(@UploadedFile() photo: Express.Multer.File, path: string) {
    return await writeFile(path, photo.buffer);
  }
}
