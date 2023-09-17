import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { RoleGuard } from './role.guard';
import { UserService } from './user/user.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    console.log('appcontrollerlogin', req.user);
    let user = req.user;

    // remove user.password;
    delete user.password;

    // const user = "dbhfgijdebgjhd";
    const tokken = await this.authService.generateToken(user);
    console.log('appcontrollerlogintoken', tokken);
    return { token: tokken };
  }

  @Post('/register')
  async register(@Body() body) {
    console.log('appcontrollerregister', body);
    const user = await this.userService.getUser(body.email);
    console.log('appcontrollerregisteruser', user);
    if (user == null) {
      let newUser = await this.userService.saveUser(body);
      console.log('appcontrollerregisternewuser', newUser);
      // delete newUser.password;
      return newUser;
    } else {
      return 'User already exists';
    }
  }

  @Get('/check')
  async check(@Request() req) {
    console.log('appcontrollercheck', req.user);
    return { user: 'req.user' };
  }

  @Get('/calender')
  async calender(@Request() req) {
    console.log('appcontrollercalender', req.user);
    return this.userService.getCalender();
  }

  @Post('/inquire')
  async inquire(@Request() req, @Body() body) {
    console.log('appcontrollerinquire', req.user);
    return this.userService.inquire(body);
  }

  @Get('/gallery/:category')
  async gallery(@Param('category') category) {
    console.log('appcontrollergallery');

    return this.userService.getGallery(category);
  }

  @Get('/gallerycategories')
  async gallerycategories() {
    console.log('appcontrollergallerycategories');

    return this.userService.getGalleryCat();
  }

  @Get('/gallery')
  async galleryall() {
    console.log('appcontrollergallery');

    return this.userService.getGalleryAll();
  }
}
