import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role.guard';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('user')
@UseGuards(AuthGuard('jwt'), new RoleGuard('user'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUser(@Request() req) {
    console.log('usercontrollergetuser', req.user.user.email);
    const user = await this.userService.getUser(req.user.user.email);
    delete user.password;
    return user;
  }

  @Post('/resetpassword')
  async updateUser(@Request() req, @Body() body) {
    if (!body.npassword || !body.opassword) {
      return BadRequestException;
    }
    console.log('usercontrollerupdateuser', req.user.user.email);
    const user = await this.userService.resetPass(req.user.user.email, body);

    return user;
  }

  @Post('/gallerycat')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async addGalleryCat(@Request() req, @Body() body, @UploadedFile() file) {
    if (
      file.mimetype != 'image/jpeg' &&
      file.mimetype != 'image/png' &&
      file.mimetype != 'image/gif'
    ) {
      return BadRequestException;
    }

    if (!body.name) {
      return BadRequestException;
    }

    console.log('usercontrolleraddproduct', req.user.user.email);
    const user = await this.userService.addGalleryCat(body, file);

    return user;
  }

  @Get('/gallerycat')
  async getGalleryCat(@Request() req) {
    return await this.userService.getGalleryCat();
  }

  @Delete('/gallerycat/:id')
  async deleteGalleryCat(@Request() req, @Param('id') id) {
    return await this.userService.deleteGalleryCat(id);
  }

  @Post('/gallery')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async addGallery(@Request() req, @Body() body, @UploadedFile() file) {
    if (
      file.mimetype != 'image/jpeg' &&
      file.mimetype != 'image/png' &&
      file.mimetype != 'image/gif'
    ) {
      return BadRequestException;
    }

    if (!body.name) {
      return BadRequestException;
    }

    console.log('usercontrolleraddproduct', req.user.user.email);
    const user = await this.userService.addGallery(body, file);

    return user;
  }

  @Get('/gallery')
  async getGalleryAll(@Request() req) {
    return await this.userService.getGalleryAll();
  }

  @Get('/gallery/:category')
  async getGallery(@Request() req, @Param('category') category) {
    return await this.userService.getGallery(category);
  }

  @Delete('/gallery/:id')
  async deleteGallery(@Request() req, @Param('id') id) {
    return await this.userService.deleteGallery(id);
  }

  @Get('/service')
  async getService(@Request() req) {
    return await this.userService.getService();
  }

  @Post('/service')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async addService(@Request() req, @Body() body, @UploadedFile() file) {
    return await this.userService.addService(body, file);
  }

  @Put('/service/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async updateService(
    @Request() req,
    @Body() body,
    @Param('id') id,
    @UploadedFile() file,
  ) {
    if (!file || file == null) {
      return await this.userService.updateServiceWithoutImage(body, id);
    }

    return await this.userService.updateService(body, id, file);
  }

  @Delete('/service/:id')
  async deleteService(@Request() req, @Param('id') id) {
    return await this.userService.deleteService(id);
  }

  @Post('/muhurta')
  async addMuhurta(@Request() req, @Body() body) {
    return await this.userService.addMuhurta(body);
  }

  @Get('/muhurta')
  async getMuhurta(@Request() req) {
    return await this.userService.getMuhurta();
  }

  @Delete('/muhurta/:id')
  async deleteMuhurta(@Request() req, @Param('id') id) {
    return await this.userService.deleteMuhurta(id);
  }

  @Get('/muhurta/:id')
  async getMuhurtaById(@Request() req, @Param('id') id) {
    return await this.userService.getMuhurtaById(id);
  }

  @Put('/muhurta/:id')
  async updateMuhurta(@Request() req, @Body() body, @Param('id') id) {
    return await this.userService.updateMuhurta(body, id);
  }

  @Get('/inuqires')
  async getInquires() {
    return await this.userService.getInquires();
  }

  @Delete('/inuqires/:id')
  async deleteInquire(@Param('id') id) {
    return await this.userService.deleteInquire(id);
  }

  @Get('/rejectinuqires/:id')
  async rejectInquire(@Param('id') id) {
    return await this.userService.rejectInquire(id);
  }
}
