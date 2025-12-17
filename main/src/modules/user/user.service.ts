import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { UserKey } from 'src/entity/userKey.entity';
import { Repository } from 'typeorm';
const md5 = require('md5');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserKey)
    private usersRepository: Repository<UserKey>,
  ) { }

  findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { userName: username } });
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validateUser(username: string, password: string) {
    const user = await this.findByUsername(username);
    console.log('-----------validateUser-----------', user)
    if (!user) return null;

    const passwordHash = md5(password)
    if (passwordHash !== user.password) {
      return null;
    }

    return user;
  }

  async getUsers(options: IPaginationOptions, searchParam) {
    const queryBuilder = this.usersRepository.createQueryBuilder('uk')
      .orderBy('uk.createdDate', 'DESC')
    const data = await paginate<UserKey>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }
}
