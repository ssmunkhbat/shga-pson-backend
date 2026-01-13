import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PriPrisonerKeyView } from 'src/entity/pri/prisoner/priPrisonerKeyView';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilter } from 'src/utils/helper';
import { PrisonerInfoDto } from 'src/dto/pri/prisoner/prisonerInfo.dto';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class PrisonerService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPrisonerKeyView)
    private prisonerKeyViewRepo: Repository<PriPrisonerKeyView>,
  ) {}

  async listAll(options: IPaginationOptions, searchParam) {
    let filterVals = JSON.parse(searchParam)
    console.log('-------filterVals---------', filterVals)
    let filter = null
    if (filterVals) {
      filter = getFilter('su', filterVals)
    }
    console.log('-------filter---------', filter)

    const queryBuilder = this.prisonerKeyViewRepo.createQueryBuilder('su')
      .where('su.endDate IS NULL')
    
    if (filter) queryBuilder.andWhere(filter)
    queryBuilder.orderBy('su.createdDate', 'DESC')
    const data = await paginate<PriPrisonerKeyView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  async findOne(prisonerId: number, user: any) {
    if (!prisonerId) {
      throw new BadRequestException("Хүсэлт тодорхойгүй!");
    }
    const query = `
      SELECT 
        IMAGE1.ATTACH AS IMAGE1, 
        IMAGE2.ATTACH AS IMAGE2, 
        IMAGE3.ATTACH AS IMAGE3, 
        BP.FAMILY_NAME, 
        BP.LAST_NAME, 
        BP.FIRST_NAME, 
        IGT.GENDER_NAME, 
        (PIAC.NAME || ' - ' || PISD.NAME) AS BIRTH_PLACE,
        (PIAC2.NAME || ' - ' || PISD2.NAME) AS ADMINISTRATION_PLACE,
        FLOOR((sysdate - BP.DATE_OF_BIRTH) / 365.242199) AS AGE,
        BP.DATE_OF_BIRTH, 
        BP.STATE_REG_NUMBER, 
        RC.COUNTRY_NAME, 
        PIN.NAME AS ORIGIN_NAME, 
        PID.NAME AS DEPARTMENT_NAME,
        PIE.NAME AS EDUCATION_NAME, 
        BP.PROFESSION, 
        BP.POSITION, 
        PIMS.NAME AS MARITAL_STATUS, 
        BP.FAMILY_MEMBER_COUNT, 
        TO_CHAR(DET.ACTION_DATE, 'yyyy-mm-dd') ACTION_DATE,
        PP.PRISONER_NUMBER
      FROM PRI_PRISONER PP
        INNER JOIN BASE_PERSON BP ON PP.PERSON_ID = BP.PERSON_ID
        LEFT JOIN PRI_PRISONER_KEY PPK ON PP.PRISONER_ID = PPK.PRISONER_ID
        LEFT JOIN PRI_DETENTION DET ON PPK.DETENTION_ID = DET.DETENTION_ID
        LEFT JOIN PRI_INFO_LAW_ACT LA ON DET.LEGAL_ACT_ID = LA.LAW_ACT_ID
        LEFT JOIN PRI_INFO_DEPARTMENT PID ON PPK.DEPARTMENT_ID = PID.DEPARTMENT_ID
        LEFT JOIN REF_COUNTRY RC ON BP.COUNTRY_ID = RC.COUNTRY_ID
        LEFT JOIN PRI_INFO_NATIONALITY PIN ON BP.NATIONALITY_ID = PIN.NATIONALITY_ID
        LEFT JOIN INFO_GENDER_TYPE IGT ON BP.GENDER_ID = IGT.GENDER_ID
        LEFT JOIN PRI_INFO_EDUCATION PIE ON BP.EDUCATION_ID = PIE.EDUCATION_ID
        LEFT JOIN (SELECT PPA.PRISONER_ID, FA.ATTACH
        FROM PRI_PRISONER_ATTACH PPA
        INNER JOIN FILE_ATTACH FA ON PPA.ATTACH_ID = FA.ATTACH_ID AND PPA.ATTACH_TYPE_ID = 1) IMAGE1 ON PP.PRISONER_ID = IMAGE1.PRISONER_ID
        LEFT JOIN (SELECT PPA.PRISONER_ID, FA.ATTACH
        FROM PRI_PRISONER_ATTACH PPA
        INNER JOIN FILE_ATTACH FA ON PPA.ATTACH_ID = FA.ATTACH_ID AND PPA.ATTACH_TYPE_ID = 2) IMAGE2 ON PP.PRISONER_ID = IMAGE2.PRISONER_ID
        LEFT JOIN (SELECT PPA.PRISONER_ID, FA.ATTACH
        FROM PRI_PRISONER_ATTACH PPA
        INNER JOIN FILE_ATTACH FA ON PPA.ATTACH_ID = FA.ATTACH_ID AND PPA.ATTACH_TYPE_ID = 3) IMAGE3 ON PP.PRISONER_ID = IMAGE3.PRISONER_ID
        LEFT JOIN PRI_INFO_MARITAL_STATUS PIMS ON BP.MARITAL_STATUS_ID = PIMS.MARITAL_STATUS_ID
        LEFT JOIN PRI_INFO_AIMAG_CITY PIAC ON BP.BIRTH_AIMAG_ID = PIAC.AIMAG_ID
        LEFT JOIN PRI_INFO_SOUM_DISTRICT PISD ON BP.BIRTH_SOUM_ID = PISD.SOUM_ID
        LEFT JOIN PRI_INFO_AIMAG_CITY PIAC2 ON BP.ADMINISTRATION_AIMAG_ID = PIAC2.AIMAG_ID
        LEFT JOIN PRI_INFO_SOUM_DISTRICT PISD2 ON BP.ADMINISTRATION_SOUM_ID = PISD2.SOUM_ID
      WHERE PP.PRISONER_ID = ${prisonerId} and end_date is null
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerInfoDto[] = plainToClass(
      PrisonerInfoDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return { main: data.length > 0 ? data[0] : null };
  }

}

