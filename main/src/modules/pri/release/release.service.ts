import { Injectable, HttpException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { PriReleaseView } from 'src/entity/pri/release/PriReleaseView';
import { PriRelease } from 'src/entity/pri/release/PriRelease';
import { PriPrisonerKey } from 'src/entity/pri/prisoner/PriPrisonerKey';
import { PriPrisoner } from 'src/entity/pri/prisoner/priPrisoner';
import { PriPrisonerBreak } from 'src/entity/pri/break/PriPrisonerBreak';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';

@Injectable()
export class PriReleaseService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriReleaseView)
    private releaseViewRepo: Repository<PriReleaseView>,
    @InjectRepository(PriRelease)
    private releaseRepo: Repository<PriRelease>,
    @InjectRepository(PriPrisonerKey)
    private prisonerKeyRepo: Repository<PriPrisonerKey>,
    @InjectRepository(PriPrisoner)
    private prisonerRepo: Repository<PriPrisoner>,
    @InjectRepository(PriPrisonerBreak)
    private prisonerBreakRepo: Repository<PriPrisonerBreak>,
    private readonly dynamicService: DynamicService,
  ) {}

  async getList(options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    try {
      const queryBuilder = this.releaseViewRepo.createQueryBuilder('rel');
      
      const { filter, parameters } = getFilterAndParameters('rel', searchParam);
      if (filter) {
        queryBuilder.where(filter, parameters);
      }

      const { field, order } = getSortFieldAndOrder('rel', sortParam);
      if (field) {
        queryBuilder.orderBy(field, order);
      } else {
        queryBuilder.orderBy('rel.createdDate', 'DESC');
      }

      const data = await paginate<PriReleaseView>(queryBuilder, options);
      return { rows: data.items, total: data.meta.totalItems };
    } catch (error) {
      console.error('PriReleaseService.getList error:', error);
      throw new HttpException(error, 500);
    }
  }

  /**
   * Хасагдсан бүртгэлийг буцааж хоригдогчийг ангийн дансанд оруулах
   * 1. PRI_RELEASE: isRolledback = 1, rolledbackDate = now
   * 2. PRI_PRISONER_KEY: wfmStatusId -> 100101 (Active)
   * 3. PRI_PRISONER: wfmStatusId -> 100101 (Active)
   * 4. PRI_PRISONER_BREAK: foundDate = now, wfmStatusId = 100402 (Found)
   */
  async returnEscaped(releaseId: number, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Release бүртгэлийг олох
      const release = await this.releaseRepo.findOne({ where: { releaseId } });
      if (!release) {
        throw new HttpException('Хасагдсан бүртгэл олдсонгүй', 404);
      }
      if (release.isRolledback === 1) {
        throw new HttpException('Энэ бүртгэл аль хэдийн буцаагдсан байна', 400);
      }

      // 2. Release-г буцаасан гэж тэмдэглэх
      await this.dynamicService.updateTableData(queryRunner, PriRelease, this.releaseRepo, {
        releaseId: releaseId,
        isRolledback: 1,
        rolledbackDate: new Date(),
      }, user);

      // 3. PriPrisonerKey төлвийг идэвхтэй болгох
      await this.dynamicService.updateTableData(queryRunner, PriPrisonerKey, this.prisonerKeyRepo, {
        prisonerKeyId: release.prisonerKeyId,
        wfmStatusId: 100101, // Active
      }, user);

      // 4. PriPrisoner төлвийг идэвхтэй болгох
      const prisonerKey = await this.prisonerKeyRepo.findOne({ where: { prisonerKeyId: release.prisonerKeyId } });
      if (prisonerKey) {
        await this.dynamicService.updateTableData(queryRunner, PriPrisoner, this.prisonerRepo, {
          prisonerId: prisonerKey.prisonerId,
          wfmStatusId: 100101, // Active
        }, user);
      }

      // 5. Оргосон бүртгэлд олдсон огноо тэмдэглэх (releaseTypeId = 1668024005679 бол оргосон)
      if (release.releaseTypeId === 1668024005679) {
        const breakRecord = await this.prisonerBreakRepo.findOne({
          where: { prisonerKeyId: release.prisonerKeyId },
          order: { createdDate: 'DESC' },
        });
        if (breakRecord && !breakRecord.foundDate) {
          await this.dynamicService.updateTableData(queryRunner, PriPrisonerBreak, this.prisonerBreakRepo, {
            prisonerBreakId: breakRecord.prisonerBreakId,
            foundDate: new Date(),
            wfmStatusId: 100402, // Found
          }, user);
        }
      }

      await queryRunner.commitTransaction();
      return { success: true, message: 'Амжилттай буцаагдлаа' };
    } catch (err) {
      console.error('PriReleaseService.returnEscaped ERROR:', err);
      await queryRunner.rollbackTransaction();
      throw err instanceof HttpException ? err : new HttpException(err, 500);
    } finally {
      await queryRunner.release();
    }
  }
}
