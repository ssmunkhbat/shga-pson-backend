import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { BaseRoleDtoValidator } from 'src/dto/validation/basePerson.dto.validator';
import { PriEmployee } from 'src/entity/pri/employee/priEmployee';
import { PriEmployeeKey } from 'src/entity/pri/employee/priEmployeeKey';
import { UmSystemUser } from 'src/entity/um/um-system-user.entity';
import { UmUserRole } from 'src/entity/um/um-user-role';
import { getFilter } from 'src/utils/helper';
import { DataSource, Repository } from 'typeorm';
import { BasePerson } from 'src/entity/base/basePerson';
import { ChangePasswordValidationDto } from 'src/dto/validation/changePassword.dto.validator';
import { PriLoginLog } from 'src/entity/log/PriLoginLog.entity';
import { getId } from 'src/utils/unique';
const md5 = require('md5');
const md5reverse = (val) => {
  const str = md5(val)
  return str.match(/.{1,2}/g).map(c => c.split('').reverse().join('')).join('')
}
@Injectable()
export class UserService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
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
    private priLoginLogRepository: Repository<PriLoginLog>
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
        // modifiedUserId: user.id,
        // modifiedDate: new Date()
      })
      if (queryRunner) return await queryRunner.manager.save(saved)
      else return await repo.save(saved)
    }
}
