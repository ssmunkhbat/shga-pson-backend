import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriEmployee } from 'src/entity/pri/employee/priEmployee';
import { PriEmployeeKey } from 'src/entity/pri/employee/priEmployeeKey';
import { UmSystemUser } from 'src/entity/um/um-system-user.entity';
import { UmUserRole } from 'src/entity/um/um-user-role';
import { getFilter } from 'src/utils/helper';
import { Repository } from 'typeorm';
const md5 = require('md5');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UmSystemUser)
    private usersRepository: Repository<UmSystemUser>,
    @InjectRepository(UmUserRole)
    private userRoleRepository: Repository<UmUserRole>,
    @InjectRepository(PriEmployee)
    private employeeRepo: Repository<PriEmployee>,
    @InjectRepository(PriEmployeeKey)
    private employeeKeyRepo: Repository<PriEmployeeKey>,
  ) { }

  findByUsername(username: string) {
    return this.usersRepository.createQueryBuilder("u")
      .innerJoin("u.person", "PER").addSelect(['PER.personId', 'PER.firstName', 'PER.lastName', 'PER.stateRegNumber'])
      .where("u.userName = :username", { username })
      .getOne();
  }

  async findById(userId: number) {
    const user = await this.usersRepository.createQueryBuilder("u")
      .innerJoin("u.person", "PER").addSelect(['PER.personId', 'PER.firstName', 'PER.lastName', 'PER.stateRegNumber'])
      .where("u.userId = :userId", { userId })
      .getOne();
    const emp = await this.employeeRepo.findOne({ where: { userId } });
    if (emp) {
      const employeeKey = await this.employeeKeyRepo.findOne({ where: { employeeId: emp.employeeId, isActive: true } });
      (user as any).employeeKey = employeeKey;
    }
    return user
  }

  async validateUser(username: string, password: string) {
    const user = await this.findByUsername(username);
    console.log('-----------validateUser-----------', user)
    if (!user) return null;

    // const passwordHash = md5(password)
    // if (passwordHash !== user.password) {
    //   return null;
    // }

    const role = await this.getUserRole(user.userId)

    return Object.assign({ roleId: role.roleId }, user);
  }

  async getUsers(options: IPaginationOptions, searchParam) {
    let filterVals = JSON.parse(searchParam)
    let filter = getFilter('su', filterVals)
    const queryBuilder = this.usersRepository.createQueryBuilder('su')
      .where(filter)
      .orderBy('su.createdDate', 'DESC')
    const data = await paginate<UmSystemUser>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  getUserRole(user_id: number) {
    return this.userRoleRepository.findOne({
      join: {
        alias: "r",
        innerJoinAndSelect: {
          role: "r.role",
        }
      },
      where: { user_id: user_id }
    });
  }
}
