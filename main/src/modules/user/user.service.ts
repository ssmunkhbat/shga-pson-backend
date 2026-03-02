import { ForbiddenException, HttpException, Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { BaseRoleDtoValidator } from 'src/dto/validation/basePerson.dto.validator';
import { PriEmployee } from 'src/entity/pri/employee/priEmployee';
import { PriEmployeeKey } from 'src/entity/pri/employee/priEmployeeKey';
import { UmSystemUser } from 'src/entity/um/um-system-user.entity';
import { UmUserRole } from 'src/entity/um/um-user-role';
import { getFilter } from 'src/utils/helper';
import { DataSource, Repository, Equal } from 'typeorm';
import { BasePerson } from 'src/entity/base/basePerson';
import { ChangePasswordValidationDto } from 'src/dto/validation/changePassword.dto.validator';
import { PriLoginLog } from 'src/entity/log/PriLoginLog.entity';
import { getId } from 'src/utils/unique';
import { UmSystemUserValidationDto } from 'src/dto/validation/settings/um.system.user.dto'
import { UmUser } from 'src/entity/um/um-user.entity'

const md5 = require('md5');
const md5reverse = (val) => {
  const str = md5(val)
  return str.match(/.{1,2}/g).map(c => c.split('').reverse().join('')).join('')
}
@Injectable()
export class UserService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(UmUser)
    private umUserRepo: Repository<UmUser>,
    @InjectRepository(UmSystemUser)
    private usersRepository: Repository<UmSystemUser>,
    @InjectRepository(UmUserRole)
    private userRoleRepository: Repository<UmUserRole>,
    @InjectRepository(PriEmployee)
    private employeeRepo: Repository<PriEmployee>,
    @InjectRepository(PriEmployeeKey)
    private employeeKeyRepo: Repository<PriEmployeeKey>,
    @InjectRepository(BasePerson)
    private basePersonRepo: Repository<BasePerson>,

    @InjectRepository(PriLoginLog)
    private priLoginLogRepository: Repository<PriLoginLog>,
  ) { }

  async findByUsername(username: string, passwordHash: string) {
    const user = await this.usersRepository.createQueryBuilder("u")
      .innerJoin("u.person", "PER").addSelect([
        'PER.personId', 'PER.firstName', 'PER.lastName', 'PER.stateRegNumber', 'PER.familyName',
        'PER.imageUrl',
        'PER.genderId', 'PER.countryId', 'PER.educationId', 'PER.nationalityId',
      ])
      .where("UPPER(u.userName) = :username", { username: username.toUpperCase() })
      .andWhere("u.passwordHash = :passwordHash", { passwordHash })
      .getOne();

    if (user) {
      delete user.passwordHash
      const emp = await this.employeeRepo.findOne({
        where: { userId: user.userId },
      });

      if (emp) {
        console.log('---findByUsername Found Employee---', emp.employeeId);
        const employeeKey = await this.employeeKeyRepo.createQueryBuilder('r')
          .leftJoinAndSelect('r.department', 'd')
          .leftJoinAndSelect('r.positionType', 'pt')
          .leftJoinAndSelect('r.militaryRank', 'mr')
          .where('r.employeeId = :empId', { empId: emp.employeeId })
          .andWhere('r.isActive = :active', { active: true })
          .orderBy('r.createdDate', 'DESC')
          .getOne();

        (user as any).employeeKey = employeeKey;
      }
    }
    return user;
  }

  async findById(userId: number) {
    const user = await this.usersRepository.createQueryBuilder("u")
      .innerJoin("u.person", "PER").addSelect([
        'PER.personId', 'PER.firstName', 'PER.lastName', 'PER.stateRegNumber', 'PER.familyName',
        'PER.imageUrl',
        'PER.genderId', 'PER.countryId', 'PER.educationId', 'PER.nationalityId',
      ])
      .where("u.userId = :userId", { userId })
      .getOne();
    const emp = await this.employeeRepo.findOne({
        where: { userId: user.userId ?? userId },
      });

    if (emp) {
      const employeeKey = await this.employeeKeyRepo.createQueryBuilder('r')
        .leftJoinAndSelect('r.department', 'd')
        .leftJoinAndSelect('r.positionType', 'pt')
        .leftJoinAndSelect('r.militaryRank', 'mr')
        .where('r.employeeId = :empId', { empId: emp.employeeId })
        .andWhere('r.isActive = :active', { active: true })
        .orderBy('r.createdDate', 'DESC')
        .getOne();
      
      (user as any).employeeKey = employeeKey;
    }
    const userRole = await this.userRoleRepository.findOne({ where: { userId } });
    if (userRole) {
      (user as any).userRole = userRole;
    }
    return user
  }
  async savePriLoginLog (user: any, ipAddress: string) {
    const log = new PriLoginLog()
    log.employeeKeyId = user.employeeKey.employeeKeyId,
    log.ipAddress = ipAddress
    log.loginDate = new Date()
    log.loginLogId = getId()
    log.userId = user.userId
    await this.priLoginLogRepository.save(log)
  }

  async validateUser(username: string, password: string, ipAddress: string) {
    const passwordHash = md5reverse(password)
    const user = await this.findByUsername(username, passwordHash);
    console.log('-----------validateUser-----------', user)
    if (!user) return null;
    const role = await this.getUserRole(user.userId)
    await this.savePriLoginLog(user, ipAddress)
    return Object.assign({ roleId: role.roleId }, user);
  }

  async changePassword (user: any, body: ChangePasswordValidationDto) {
    const user1 = await this.findById(user.userId)
    const { currentPassword, newPassword, confirmPassword } = body
    const passwordHash = md5reverse(currentPassword)
    if (passwordHash !== user1.passwordHash) {
      throw new ForbiddenException('Одоогийн нууц үг буруу байна.')
    }
    if (newPassword.length < 6) {
      throw new ForbiddenException('Шинэ нууц үг 6 дээш тэмдэгт байх шаардлагатай.')
    }
    if (newPassword !== confirmPassword) {
      throw new ForbiddenException('Нууц үг давтах буруу байна.')
    }
    user1.passwordHash = md5reverse(newPassword)
    if (user1.passwordHash === passwordHash) {
      throw new ForbiddenException('Шинэ нууц үг одоогийн нууц үгтэй ижил байж болохгүй')
    }
    user1.changeDate = new Date()
    await this.usersRepository.save(user1)
    return { success: true }
  }

  async getUsers(options: IPaginationOptions, searchParam) {
    let filterVals = JSON.parse(searchParam)
    let filter = getFilter('su', filterVals)
    const queryBuilder = this.usersRepository.createQueryBuilder('su')
      .leftJoin("su.person", "PER").addSelect(['PER.personId', 'PER.firstName', 'PER.lastName', 'PER.stateRegNumber'])
        // EMPLOYEE
        .leftJoinAndSelect('PER.employee', 'EMP')
        // EMPLOYEE KEY
        .leftJoinAndSelect('EMP.employeeKey', 'EK')
        // INFOS
        .leftJoinAndSelect('EK.positionType', 'PT')
        .leftJoinAndSelect('EK.militaryRank', 'MR')
        .leftJoinAndSelect('EK.department', 'DEP')
      .where(filter)
      .orderBy('su.createdDate', 'DESC');
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
      where: { userId: user_id }
    });
  }
  
  async saveBasePerson(dto: BaseRoleDtoValidator, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const body = dto;
      await this.updateTableData(queryRunner, BasePerson, this.basePersonRepo, body, user)

      await queryRunner.commitTransaction();
      return { success: true }
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  //#region [DYNAMIC]

  /**
   * 
   * @param queryRunner 
   * @param TableEntity Entity
   * @param repo Repository
   * @param data any
   * @param user any
   * @returns data
   */
  async createTableData(queryRunner = null, TableEntity, repo, data, user) {
    const saved = new TableEntity({
      id: getId(),
      ...data,
      // isActive: true,
      // createdUserId: user.id,
      // createdDate: new Date(),
    })
    if (queryRunner) return await queryRunner.manager.save(saved)
    else return await repo.save(saved)
  }

  /**
   * 
   * @param queryRunner 
   * @param TableEntity Entity
   * @param repo Repository
   * @param data any
   * @param user any
   * @returns void
   */
  async updateTableData(queryRunner = null, TableEntity, repo, data, user) {
    const saved = new TableEntity({
      ...data,
      modifiedUserId: user.id,
      modifiedDate: new Date()
    })
    if (queryRunner) return await queryRunner.manager.save(saved)
    else return await repo.save(saved)
  }

  //#endregion  
  
  //#region [CRUD]
  
  async createAndUpdate(dto: UmSystemUserValidationDto, user: any) {
    console.log('--------createAndUpdate--------', dto);
    return dto.userId
      ? this.update(dto, user)
      : this.create(dto, user);
  }

  async create(dto: UmSystemUserValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const count = await queryRunner.manager.count(PriEmployee, {
        where: { employeeCode: Equal(dto.employeeCode) },
      });
      if (count > 0) {
        throw new BadRequestException(`${dto.employeeCode} Албан хаагчийн код давхардаж байна!`);
      }
      const passwordHash = md5reverse(dto.password)
      const newUmSystemUser = Object.assign({
        userId: await getId(),
        userName: dto.userName,
        passwordHash: passwordHash,
        personId: dto.personId,
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId
      });
      const savedUmSystemUser = await this.createTableData(queryRunner, UmSystemUser, this.usersRepository, newUmSystemUser, user)
      const newUmUser = Object.assign({
        userId: savedUmSystemUser.userId,
        userName: dto.userName,
        systemUserId: savedUmSystemUser.userId,
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId
      });
      const savedUmUser = await this.createTableData(queryRunner, UmUser, this.umUserRepo, newUmUser, user)
      
      const newPriEmployee = Object.assign({
        employeeId: await getId(),
        personId: dto.personId,
        employeeCode: dto.employeeCode,
        userId: savedUmUser.userId,
        isActive: true,
        createdDate: new Date(),
      });
      const savedPriEmployee = await this.createTableData(queryRunner, PriEmployee, this.employeeRepo, newPriEmployee, user)
      
      const newPriEmployeeKey = Object.assign({
        employeeKeyId: await getId(),
        employeeId: savedPriEmployee.employeeId,
        departmentId: dto.departmentId,
        positionTypeId: dto.positionTypeId,
        militaryRankId: dto.militaryRankId,
        employeeCode: dto.employeeCode,
        isActive: true,
        createdDate: new Date(),
      });
      await this.createTableData(queryRunner, PriEmployeeKey, this.employeeKeyRepo, newPriEmployeeKey, user)

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async update(dto: UmSystemUserValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const umSystemUser = await queryRunner.manager.findOne(UmSystemUser, {
        where: { userId: dto.userId },
      });
      if (!umSystemUser) {
        throw new BadRequestException(`Бүртгэл олдсонгүй!`)
      }
      const umUser = await queryRunner.manager.findOne(UmUser, {
        where: { userId: dto.userId },
      });
      if (!umUser) {
        throw new BadRequestException(`Бүртгэл олдсонгүй!`)
      }

      const priEmployee = await queryRunner.manager.findOne(PriEmployee, {
        where: { userId: dto.userId, personId: dto.personId, isActive: true },
      });
      if (!priEmployee) {
        throw new BadRequestException(`Албан хаагчийн бүртгэл олдсонгүй!`)
      }
      const priEmployeeKey = await queryRunner.manager.findOne(PriEmployeeKey, {
        where: { employeeId: priEmployee.employeeId, isActive: true },
      });
      if (!priEmployeeKey) {
        throw new BadRequestException(`Албан хаагчийн бүртгэл олдсонгүй!`)
      }

      umUser.userName = dto.userName
      umSystemUser.userName = dto.userName
      umSystemUser.personId = dto.personId
      priEmployee.employeeCode = dto.employeeCode
      priEmployeeKey.departmentId = dto.departmentId
      priEmployeeKey.positionTypeId = dto.positionTypeId
      priEmployeeKey.militaryRankId = dto.militaryRankId
      await this.updateTableData(queryRunner, UmUser, this.umUserRepo, umUser, user)
      await this.updateTableData(queryRunner, UmSystemUser, this.usersRepository, umSystemUser, user)
      await this.updateTableData(queryRunner, PriEmployee, this.employeeRepo, priEmployee, user)
      await this.updateTableData(queryRunner, PriEmployeeKey, this.employeeKeyRepo, priEmployeeKey, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async findUserRoles(userId: number) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId, isActive: true },
      relations: ['role'],
    });
    return userRoles.map(r => { return { roleId: r.roleId, roleName: r?.role.roleName } })
  }

  //#endregion

}
