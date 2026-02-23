import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { FileAttach } from 'src/entity/FileAttach.entity'
import { getId } from 'src/utils/unique'
import { getFilter, isNull } from 'src/utils/helper'
import { paginate, IPaginationOptions, } from 'nestjs-typeorm-paginate';

@Injectable()
export class FileAttachService {
    constructor(
		@InjectDataSource() private dataSource: DataSource,
		@InjectRepository(FileAttach)
		private readonly repo: Repository<FileAttach>,
	) { }

  async createFile(query, user, files) {
    const uploadFiles = []
    console.log(query, '---query---', files)
    for (const file of files) {
      const data = {
        attachId: getId(),
        tableId: query.tableId,
        tableName: query.tableName,
        folderId: query.folderId,
        fileSystemName: file.filename,
        originalName: file.originalname,
        isActive: true,
        createdDate: new Date(),
		    createdUserId: user.userId
      }
      const result = await this.repo.save(data)
      console.log(result, '---result---')
      uploadFiles.push(result)
    }
    return { 'total': uploadFiles.length, files: uploadFiles }
  }

  async put(req) {
    if(req && req.body) {
      const updatedField = {
        attachName: req.body.name,
      }
      await this.repo.update({ attachId: req.body.savedId }, updatedField)
    }
    return { success: true }
  }

  async getFile(id: number) {
    const result: any = await this.repo.findOne({ where: { attachId: id } })
    return result
  }

  async getFiles(options: IPaginationOptions, searchParam) {
		let filterVals = JSON.parse(searchParam)
    let filter = getFilter('a', filterVals)
    const queryBuilder = this.repo.createQueryBuilder('a')
      .innerJoinAndSelect("a.createdUser", "createdUser")
    //   .leftJoinAndSelect("createdUser.userInfo", "userInfo")
      .orderBy('a.createdDate', 'DESC')
      .where(filter)
      .andWhere('a.isActive = 1')
    const data = await paginate<FileAttach>(queryBuilder, options);
		return data
	}

  async getList(options: IPaginationOptions, searchParam) {
    let search = JSON.parse(searchParam)
    let filter = ''
    if (!isNull(search)) {
      filter = `a.tableId = ${search.tableId} and a.tableName = '${search.tableName}'`
    }
    const queryBuilder = this.repo.createQueryBuilder('a')
      .innerJoinAndSelect("a.createdUser", "createdUser")
      .leftJoinAndSelect("createdUser.userInfo", "userInfo")
      .orderBy('a.createdDate', 'DESC')
      .where(filter)
      .andWhere('a.isActive = 1')
    const data = await paginate<FileAttach>(queryBuilder, options);
		return data
	}

  async removeFile(id: number) {
    // await this.repo.update({ attachId: id }, { isActive: false })
    return true
  }

}