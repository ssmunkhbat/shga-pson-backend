import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UmRole } from 'src/entity/um/umRole';
import { getId } from 'src/utils/unique';
import { Repository } from 'typeorm';

const dynamicTableNames = {
  'UmRole': UmRole,
}
const dynamicTableRepos = {
  'UmRole': 'roleRepo',
}

@Injectable()
export class DynamicService {
  constructor(
    @InjectRepository(UmRole)
    private roleRepo: Repository<UmRole>,
  ) {}

    //#region Dynamic table data

    // async findOne(repoName, ) {
    //   return await this[repoName].save(saved)
    // }

    /**
     * 
     * @param queryRunner 
     * @param tableName string
     * @param repoName string
     * @param data any
     * @param user any
     * @returns void
     */
    async createTableData(queryRunner = null, tableName, repoName, data, user) {
      const saved = new dynamicTableNames[tableName]({
        // id: getId(),
        ...data,
        // isActive: true,
        // createdUserId: user.id,
        // createdDate: new Date(),
      })
			if (queryRunner) return await queryRunner.manager.save(saved)
			else return await this[repoName].save(saved)
    }

    //#endregion

}
