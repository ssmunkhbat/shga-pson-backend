import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePerson } from 'src/entity/base/basePerson';
import { UmRole } from 'src/entity/um/umRole';
import { getId } from 'src/utils/unique';
import { Repository } from 'typeorm';

const dynamicTableNames = {
  'UmRole': UmRole,
  'BasePerson': BasePerson,
}
const dynamicTableRepos = {
  'UmRole': 'roleRepo',
  'BasePerson': 'basePersonRepo',
}

@Injectable()
export class DynamicService {
  constructor(
    @InjectRepository(UmRole)
    private roleRepo: Repository<UmRole>,
    
    @InjectRepository(BasePerson)
    private basePersonRepo: Repository<BasePerson>,
  ) {}

    //#region Dynamic table data

    // async findOne(repoName, ) {
    //   return await this[repoName].save(saved)
    // }

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
        // modifiedUserId: user.id,
        // modifiedDate: new Date()
      })
      if (queryRunner) return await queryRunner.manager.save(saved)
      else return await repo.save(saved)
    }

    /**
     * 
     * @param queryRunner 
     * @param repo Repository
     * @param id number
     * @returns repo.delete
     */
    async deleteHardTableData(queryRunner = null, repo, id: number) {
      if (queryRunner) {
        return await queryRunner.manager.delete(repo.target, id);
      }
      return await repo.delete(id);
    }

    //#endregion

}
