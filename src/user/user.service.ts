import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleGuard } from 'src/role.guard';
import * as fs from 'fs';

import * as bcrypt from 'bcrypt';
import { GalleryEntity, GallerycatEntity } from './gallery.entity';
import { serviceEntity } from './service.entity';
import { MuhurtaEntity, MuhurtatimeEntity } from './muhurta.entity';
import { InquireEntity } from './inuire.entity';
const saltRounds = 13;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(GallerycatEntity)
    private readonly gallerycatRepository: Repository<GallerycatEntity>,

    @InjectRepository(GalleryEntity)
    private readonly galleryRepository: Repository<GalleryEntity>,

    @InjectRepository(serviceEntity)
    private readonly serviceRepository: Repository<serviceEntity>,

    @InjectRepository(MuhurtaEntity)
    private readonly muhurtaRepository: Repository<MuhurtaEntity>,

    @InjectRepository(MuhurtatimeEntity)
    private readonly muhurtatimeRepository: Repository<MuhurtatimeEntity>,

    @InjectRepository(InquireEntity)
    private readonly inquireRepository: Repository<InquireEntity>,
  ) {}
  async getUser(email: string) {
    console.log('usercontrollergetuser', email);
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    console.log(user);
    return user;
  }

  async saveUser(body) {
    if (!body.email || !body.password) {
      return { status: 'fail', message: 'Email and password are required' };
    }
    let user = new UserEntity();
    user.email = body.email;
    user.password = await bcrypt.hash(body.password, saltRounds);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async resetPass(email, body) {
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return { status: 'fail', message: 'User not found' };
    }
    if (!body.npassword || !body.opassword) {
      return {
        status: 'fail',
        message: 'New password and old password are required',
      };
    }

    const match = await bcrypt.compare(body.opassword, user.password);
    console.log('match', match);
    if (match) {
      user.password = await bcrypt.hash(body.npassword, saltRounds);
      user = await this.userRepository.save(user);
      delete user.password;
      return user ? { status: 'success' } : BadRequestException;
    }
    return { status: 'fail', message: 'Old password is incorrect' };
  }

  async addGalleryCat(body, file) {
    if (!body.name) {
      return { status: 'fail', message: 'Name is required' };
    }

    const pastgalcat = await this.gallerycatRepository.findOne({
      where: {
        name: body.name,
      },
    });
    if (pastgalcat) {
      return { status: 'fail', message: 'Gallery category already exists' };
    }

    let gallerycat = new GallerycatEntity();
    gallerycat.name = body.name;
    gallerycat.thumbnail = file.filename;
    gallerycat = await this.gallerycatRepository.save(gallerycat);

    return gallerycat?.id ? { status: 'success' } : BadRequestException;
  }

  async getGalleryCat() {
    let gallerycat = await this.gallerycatRepository.find();
    return gallerycat;
  }

  async deleteGalleryCat(id) {
    let gallerycat = await this.gallerycatRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!gallerycat) {
      return { status: 'fail', message: 'Gallery category not found' };
    }

    // delete image
    const path = './uploads/' + gallerycat.thumbnail;

    await fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    gallerycat = await this.gallerycatRepository.remove(gallerycat);
    return gallerycat ? { status: 'success' } : BadRequestException;
  }

  async addGallery(body, file) {
    if (!body.name) {
      return { status: 'fail', message: 'Name is required' };
    }
    if (!body.category) {
      return { status: 'fail', message: 'Category is required' };
    }

    // const pastgal = await this.galleryRepository.findOne({
    //   where: {
    //     name: body.name,
    //   },
    // });
    // console.log('body');
    // if (pastgal) {
    //   return { status: 'fail', message: 'Gallery already exists' };
    // }

    console.log('body', body);

    let gallery = new GalleryEntity();
    gallery.name = body.name;
    gallery.image = file.filename;
    const galcat = await this.gallerycatRepository.findOne({
      where: {
        name: body.category,
      },
    });
    if (!galcat) {
      return { status: 'fail', message: 'Gallery category not found' };
    }
    gallery.category = galcat;
    console.log('gallery', gallery);
    gallery = await this.galleryRepository.save(gallery);

    return gallery?.id ? { status: 'success' } : BadRequestException;
  }

  async getGalleryAll() {
    let gallery = await this.galleryRepository.find({
      relations: ['category'],
    });

    return gallery;
  }

  async getGallery(category) {
    // check if category exists
    const galcat = await this.gallerycatRepository.findOne({
      where: {
        name: category,
      },
    });
    if (!galcat) {
      return { status: 'fail', message: 'Gallery category not found' };
    }

    let gallery = await this.galleryRepository.find({
      where: {
        category: { name: category },
      },
      relations: ['category'],
    });

    return gallery;
  }

  async deleteGallery(id) {
    let gallery = await this.galleryRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!gallery) {
      return { status: 'fail', message: 'Gallery not found' };
    }

    // delete image
    const path = './uploads/' + gallery.image;

    await fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    gallery = await this.galleryRepository.remove(gallery);
    return gallery ? { status: 'success' } : BadRequestException;
  }

  async getService() {
    let service = await this.serviceRepository.find();
    return service;
  }

  async addService(body, file) {
    if (!body.name) {
      return { status: 'fail', message: 'Name is required' };
    }

    const pastser = await this.serviceRepository.findOne({
      where: {
        name: body.name,
      },
    });
    if (pastser) {
      return { status: 'fail', message: 'Service already exists' };
    }

    let service = new serviceEntity();
    service.name = body.name;
    service.priority = body.priority;
    service.description = body.description;
    service.tagline = body.tagline;
    service.image = file.filename;
    service = await this.serviceRepository.save(service);

    return service?.id ? { status: 'success' } : BadRequestException;
  }

  async deleteService(id) {
    let service = await this.serviceRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!service) {
      return { status: 'fail', message: 'Service not found' };
    }

    // delete image
    const path = './uploads/' + service.image;

    await fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    service = await this.serviceRepository.remove(service);
    return service ? { status: 'success' } : BadRequestException;
  }

  async updateService(Body, id, file) {
    let service = await this.serviceRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!service) {
      return { status: 'fail', message: 'Service not found' };
    }

    service.name = Body.name;
    service.priority = Body.priority;
    service.description = Body.description;
    service.tagline = Body.tagline;
    service.image = file.filename;
    service = await this.serviceRepository.save(service);

    return service?.id ? { status: 'success' } : BadRequestException;
  }

  async updateServiceWithoutImage(Body, id) {
    let service = await this.serviceRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!service) {
      return { status: 'fail', message: 'Service not found' };
    }

    service.name = Body.name;
    service.priority = Body.priority;
    service.description = Body.description;
    service.tagline = Body.tagline;
    service = await this.serviceRepository.save(service);

    return service?.id ? { status: 'success' } : BadRequestException;
  }

  async addMuhurta(body) {
    let muhurta = new MuhurtaEntity();
    muhurta.date = body.date;
    muhurta.month = body.month;
    muhurta.paksha = body.paksha;
    muhurta = await this.muhurtaRepository.save(muhurta);

    let time = body.time;

    for (let i = 0; i < time.length; i++) {
      console.log(time[i]);
      let muhurtatime = new MuhurtatimeEntity();
      muhurtatime.time = time[i].time;
      muhurtatime.tithi = time[i].tithi;
      muhurtatime.muhurtadate = muhurta;
      muhurtatime = await this.muhurtatimeRepository.save(muhurtatime);
    }
    await this.muhurtaRepository.save(muhurta);
    return muhurta?.id ? { status: 'success' } : BadRequestException;
  }

  async getMuhurta() {
    let muhurta = await this.muhurtaRepository.find({
      relations: ['muhurtatime'],
    });
    return muhurta;
  }

  async deleteMuhurta(id) {
    let muhurta = await this.muhurtaRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!muhurta) {
      return { status: 'fail', message: 'Muhurta not found' };
    }

    muhurta = await this.muhurtaRepository.remove(muhurta);
    return muhurta ? { status: 'success' } : BadRequestException;
  }

  async getMuhurtaById(id) {
    let muhurta = await this.muhurtaRepository.findOne({
      where: {
        id: id,
      },
      relations: ['muhurtatime'],
    });
    return muhurta;
  }

  async updateMuhurta(body, id) {
    let muhurta = await this.muhurtaRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!muhurta) {
      return { status: 'fail', message: 'Muhurta not found' };
    }
    muhurta.date = body.date;
    muhurta.month = body.month;
    muhurta.paksha = body.paksha;
    muhurta = await this.muhurtaRepository.save(muhurta);

    let time = body.time;

    // remove old time
    let oldtime = await this.muhurtatimeRepository.find({
      where: {
        muhurtadate: { id: id },
      },
    });

    for (let i = 0; i < oldtime.length; i++) {
      await this.muhurtatimeRepository.remove(oldtime[i]);
    }

    // add new time

    for (let i = 0; i < time.length; i++) {
      console.log(time[i]);
      let muhurtatime = new MuhurtatimeEntity();
      muhurtatime.time = time[i].time;
      muhurtatime.tithi = time[i].tithi;
      muhurtatime.muhurtadate = muhurta;
      muhurtatime = await this.muhurtatimeRepository.save(muhurtatime);
    }
    await this.muhurtaRepository.save(muhurta);
    return muhurta?.id ? { status: 'success' } : BadRequestException;
  }

  async getCalender() {
    let calender = await this.muhurtatimeRepository.find({
      relations: ['muhurtadate'],
    });
    let ncal = [];
    // change time to start and tithi ti title

    let bookeddates = await this.inquireRepository.find({
      select: ['date'],
    });

    console.log('bookeddates', bookeddates);

    // remove booked dates from calender
    // for (let i = 0; i < calender.length; i++) {
    //   for (let j = 0; j < bookeddates.length; j++) {
    //     console.log('calender', calender[i].muhurtadate.date);
    //     console.log('bookeddates', bookeddates[j].date);
    //     console.log(calender[i].muhurtadate.date == bookeddates[j].date);
    //     if (calender[i].muhurtadate.date == bookeddates[j].date) {
    //       calender.splice(i, 1);
    //     }
    //   }
    // }

    for (let i = 0; i < calender.length; i++) {
      // pass if date is booked
      console.log('calender', calender[i].muhurtadate.status);
      if (calender[i].muhurtadate.status == 'booked') {
        continue;
      }
      let obj = {
        title: calender[i].tithi,
        start: calender[i].time,
      };
      ncal.push(obj);
    }
    return ncal;
  }

  async inquire(body) {
    console.log(body);
    let inquire = new InquireEntity();
    inquire.name = body.name;
    inquire.email = body.email;
    inquire.mobile = body.mobile;
    // convert date to date format
    let date = new Date(body.date);
    inquire.date = date;
    inquire.groupsize = body.groupsize;
    inquire.event = body.eventtype;
    inquire.utr = body.utr;
    inquire = await this.inquireRepository.save(inquire);

    let muhurta = await this.muhurtatimeRepository.findOne({
      where: {
        time: body.time,
      },
      relations: ['muhurtadate'],
    });

    muhurta.muhurtadate.status = 'booked';
    await this.muhurtaRepository.save(muhurta.muhurtadate);
    return inquire?.id ? { status: 'success' } : BadRequestException;
  }

  async getInquires() {
    let inquire = await this.inquireRepository.find();
    return inquire;
  }

  async deleteInquire(id) {
    let inquire = await this.inquireRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!inquire) {
      return { status: 'fail', message: 'Inquire not found' };
    }

    // change status of muhurta
    let muhurta = await this.muhurtatimeRepository.findOne({
      where: {
        time: inquire.date,
      },
      relations: ['muhurtadate'],
    });
    if (muhurta) {
      muhurta.muhurtadate.status = 'available';
      await this.muhurtaRepository.save(muhurta.muhurtadate);
    }
    inquire = await this.inquireRepository.remove(inquire);
    return inquire ? { status: 'success' } : BadRequestException;
  }

  async rejectInquire(id) {
    let inquire = await this.inquireRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!inquire) {
      return { status: 'fail', message: 'Inquire not found' };
    }

    inquire.status = 'rejected';
    inquire = await this.inquireRepository.save(inquire);

    // change status of muhurta
    console.log(inquire.date);
    let muhurta = await this.muhurtatimeRepository.findOne({
      where: {
        time: inquire.date,
      },
      relations: ['muhurtadate'],
    });
    console.log(muhurta);
    if (muhurta) {
      muhurta.muhurtadate.status = 'available';
      await this.muhurtaRepository.save(muhurta.muhurtadate);
    }

    return inquire ? { status: 'success' } : BadRequestException;
  }
}
