import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { PriPrisonerKeyView } from 'src/entity/pri/prisoner/priPrisonerKeyView';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilter } from 'src/utils/helper';
import { PrisonerPersonalInfoDto } from 'src/dto/pri/prisoner/personal.Info.dto';
import { plainToClass } from '@nestjs/class-transformer';
import { PriPrisoner } from 'src/entity/pri/prisoner/priPrisoner';
import { PriPrisonerKey } from 'src/entity/pri/prisoner/PriPrisonerKey';
import { PrisonerCardPersonalDto } from 'src/dto/pri/prisoner/card/personal.dto';
import { PrisonerCardAddressDto } from 'src/dto/pri/prisoner/card/address.dto';
import { PrisonerCardBodyAttributeDto } from 'src/dto/pri/prisoner/card/body.attribute.dto';
import { PrisonerCardFamilyDto } from 'src/dto/pri/prisoner/card/family.dto';
import { PrisonerCardJailPlanDto } from 'src/dto/pri/prisoner/card/jailPlan/jailPlan.dto';
import { PrisonerCardJailPlanChangeListDto } from 'src/dto/pri/prisoner/card/jailPlan/changeList.dto';
import { PrisonerCardJailPlanDetailDto } from 'src/dto/pri/prisoner/card/jailPlan/detail.dto';
import { PrisonerCardJailPlanFineDto } from 'src/dto/pri/prisoner/card/jailPlan/fine.dto';
import { PrisonerCardMovementDepartureDto } from 'src/dto/pri/prisoner/card/movement.department.dto';
import { PrisonerCardOldJailListDto } from 'src/dto/pri/prisoner/card/old.jail.list.dto';
import { PrisonerCardReleaseDto } from 'src/dto/pri/prisoner/card/release.dto';
import { PrisonerCardSymptomDto } from 'src/dto/pri/prisoner/card/symptom.dto';
import { PrisonerCardOffenceDto } from 'src/dto/pri/prisoner/card/offence.dto';
import { PrisonerCardJailPlanDepriveDto } from 'src/dto/pri/prisoner/card/jailPlan/deprive.dto';
import { PrisonerCardJailPlanForceWorkDto } from 'src/dto/pri/prisoner/card/jailPlan/forceWork.dto';
import { PrisonerCardBonusDayDto } from 'src/dto/pri/prisoner/card/bonusDay.dto';
import { PrisonerCardJailPlanHamDto } from 'src/dto/pri/prisoner/card/jailPlan/ham.dto';
import { PriJailPanDetailDto } from 'src/dto/pri/jailPlan/detail.dto';
import { PrisonerCardJailPlanJailTimeDto } from 'src/dto/pri/prisoner/card/jailPlan/jail.time.dto';
import { PrisonerCardJailPlanJailBreakDto } from 'src/dto/pri/prisoner/card/jailPlan/jail.break.dto';
import { CreatePrisonerCardPersonalInfoDto } from 'src/dto/validation/pri/prisoner/card/personalInfo.dto';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { BasePerson } from 'src/entity/base/basePerson';

@Injectable()
export class PrisonerService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPrisoner)
    private prisonerRepo: Repository<PriPrisoner>,
    @InjectRepository(PriPrisonerKey)
    private prisonerKeyRepo: Repository<PriPrisonerKey>,
    @InjectRepository(PriPrisonerKeyView)
    private prisonerKeyViewRepo: Repository<PriPrisonerKeyView>,
    private readonly dynamicService: DynamicService,
    @InjectRepository(BasePerson)
    private basePersonRepo: Repository<BasePerson>,
  ) {}

  //#region [LIST]

  async listAll(options: IPaginationOptions, searchParam, user: any) {
    let filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('su', filterVals)
    }

    const queryBuilder = this.prisonerKeyViewRepo.createQueryBuilder('su')
      .where('su.endDate IS NULL')
    
    if (filter) queryBuilder.andWhere(filter)

    if (user.userId !== 1) {
      if (user.employeeKey?.departmentId) {
        queryBuilder[!!filter ? "andWhere" : "where"](
          "su.departmentId = :departmentId",
          { departmentId: user.employeeKey.departmentId }
        );
      }
    }

    queryBuilder.orderBy('su.createdDate', 'DESC')
    const data = await paginate<PriPrisonerKeyView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  async listArrested(options: IPaginationOptions, searchParam, user: any) {
    let filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('su', filterVals)
    }

    const queryBuilder = this.prisonerKeyViewRepo.createQueryBuilder('su')
      .where('su.endDate IS NULL AND su.wfmStatusId = 100101')
    
    if (filter) queryBuilder.andWhere(filter)

    if (user.userId !== 1) {
      if (user.employeeKey?.departmentId) {
        queryBuilder[!!filter ? "andWhere" : "where"](
          "su.departmentId = :departmentId",
          { departmentId: user.employeeKey.departmentId }
        );
      }
    }

    queryBuilder.orderBy('su.createdDate', 'DESC')
    const data = await paginate<PriPrisonerKeyView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  //#endregion

  //#region [API]

  async findPrisonerCard(prisonerId: number, user: any) {
    if (!prisonerId) {
      throw new BadRequestException("Хүсэлт тодорхойгүй!");
    }
    const data = await this.getPrisonerCardAll(prisonerId)
    return data;
  }

  async findOnePersonalInfo(prisonerId: number, user: any) {
    if (!prisonerId) {
      throw new BadRequestException("Хүсэлт тодорхойгүй!");
    }
    const prisoner = await this.prisonerRepo.findOne({ where: { prisonerId } })
    if (!prisoner) {
      throw new BadRequestException("Not found!");
    }

    const personalInfo = await this.getPrisonerPersonalData(prisoner.personId)
    return { main: personalInfo };
  }

  async findOneJailInfo(prisonerId: number, user: any) {
    if (!prisonerId) {
      throw new BadRequestException("Хүсэлт тодорхойгүй!");
    }
    const data = await this.getPrisonerJailData(prisonerId)
    return data;
  }

  async saveCardPersonalInfo(dto: CreatePrisonerCardPersonalInfoDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const body = await this.getBasePersonDataFromDTO(dto)
		  await this.dynamicService.updateTableData(queryRunner, BasePerson, this.basePersonRepo, body, user)

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

  async getPrisonerDetailMenu(user: any) {
    console.log('---------------getPrisonerDetailMenu------------------', user)
    // const data = await this.getPrisonerCardAll(prisonerId)
    // return data;
    return []
  }

  //#endregion

  //#region [PERSONAL]

  async getPrisonerPersonalData(personId: number) {
    if (!personId) return null
    const query = `
      SELECT
      PPK.PRISONER_KEY_ID,
      C.COUNTRY_NAME,
      GT.GENDER_NAME,
      IE.EDUCATION_ID,
      IE.NAME AS EDUCATION_NAME,
      INA.NAME AS NATIONALITY_NAME,
      PP.PRISONER_ID,
      PP.NICKNAME,
      PP.PRISONER_NUMBER,
      PP.PICTURE_PATH,
      IMAGE.ATTACH,
      (PIAC.NAME || ' - ' || PISD.NAME) AS BIRTH_PLACE,
      BP.* 
      FROM BASE_PERSON BP
      LEFT JOIN REF_COUNTRY C ON BP.COUNTRY_ID = C.COUNTRY_ID
      LEFT JOIN INFO_GENDER_TYPE GT ON BP.GENDER_ID = GT.GENDER_ID
      LEFT JOIN PRI_INFO_EDUCATION IE ON BP.EDUCATION_ID = IE.EDUCATION_ID
      LEFT JOIN PRI_INFO_NATIONALITY INA ON BP.NATIONALITY_ID = INA.NATIONALITY_ID
      LEFT JOIN PRI_PRISONER PP ON BP.PERSON_ID = PP.PERSON_ID
      LEFT JOIN PRI_PRISONER_KEY PPK ON PP.PRISONER_ID = PPK.PRISONER_ID AND PPK.END_DATE IS NULL
      LEFT JOIN (SELECT PPA.PRISONER_ID, FA.ATTACH FROM PRI_PRISONER_ATTACH PPA INNER JOIN FILE_ATTACH FA ON PPA.ATTACH_ID = FA.ATTACH_ID AND PPA.ATTACH_TYPE_ID = 1) IMAGE ON PP.PRISONER_ID = IMAGE.PRISONER_ID
      LEFT JOIN PRI_INFO_AIMAG_CITY PIAC ON BP.BIRTH_AIMAG_ID = PIAC.AIMAG_ID
      LEFT JOIN PRI_INFO_SOUM_DISTRICT PISD ON BP.BIRTH_SOUM_ID = PISD.SOUM_ID
      WHERE BP.PERSON_ID = ${personId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerPersonalInfoDto[] = plainToClass(
      PrisonerPersonalInfoDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data.length > 0 ? data[0] : null
  }

  //#endregion

  //#region [JAIL]

  async getPrisonerJailData(prisonerId: number) {
    const jailPlan = await this.getJailPlanData(prisonerId);
    if (!jailPlan) {
      return { jailPlan, jailPlanDetail: [], allBonusDays: [], jailPlanDetailCode: [], };
    }

    const [jailPlanDetail, jailPlanDetailCode] = await Promise.all([
      this.getJailPlanDetailData(jailPlan.JAIL_PLAN_ID),
      this.getJailPlanDetailCodeData(jailPlan.JAIL_PLAN_ID),
    ]);

    const prisonerKey = await this.prisonerKeyRepo.findOne({
      where: { prisonerId, endDate: IsNull() },
    });
    if (!prisonerKey) {
      return { jailPlan, jailPlanDetail, allBonusDays: [], jailPlanDetailCode, };
    }

    const allBonusDays = await this.getBonusDaysData(prisonerKey.detentionId);

    return { jailPlan, jailPlanDetail, allBonusDays, jailPlanDetailCode, };
  }

  async getJailPlanData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT p.JAIL_PLAN_ID, p.JAIL_BEGIN_DATE, p.DAYS_IN_CUSTODY, (p.JAIL_BEGIN_DATE - p.DAYS_IN_CUSTODY) AS JAIL_START_DATE
      FROM PRI_JAIL_PLAN p
      WHERE p.PRISONER_ID = ${prisonerId} and p.IS_ACTIVE = 1
      AND p.JAIL_PLAN_TYPE_ID = 1
    `;
    const data = await this.dataSource.query(query);
    return data.length > 0 ? data[0] : null
  }

  async getJailPlanDetailData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT PJPD.JAIL_YEARS, PJPD.JAIL_MONTHS, PJPD.JAIL_DAYS
      FROM PRI_JAIL_PLAN_DETAIL PJPD
      WHERE PJPD.JAIL_PLAN_ID = ${jailPlanId}
      AND PJPD.IS_ACTIVE = 1
    `;
    const data = await this.dataSource.query(query);
    return data
  }

  async getBonusDaysData(detentionId: number) {
    if (!detentionId) return null
    const query = `
      SELECT SUM(T.ADD_DAYS) - SUM(T.SUB_DAYS) NET_DAYS
      FROM (
        SELECT
          CASE WHEN PPBD.BONUS_DAY_TYPE_ID = 1 THEN PPBD.DAYS ELSE 0 END ADD_DAYS,
          CASE WHEN PPBD.BONUS_DAY_TYPE_ID = 2 THEN PPBD.DAYS ELSE 0 END SUB_DAYS
        FROM PRI_PRISONER_BONUS_DAY PPBD
        INNER JOIN PRI_PRISONER_KEY PPK ON PPBD.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
        WHERE PPK.DETENTION_ID = ${detentionId}
      ) T
    `;
    const data = await this.dataSource.query(query);
    return data
  }

  async getJailPlanDetailCodeData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT PILA.CODE
      FROM PRI_JAIL_PLAN_DETAIL PJPD
      LEFT JOIN PRI_JAIL_PLAN_DETAIL_LAW PJPDL ON PJPD.JAIL_PLAN_DETAIL_ID = PJPDL.JAIL_PLAN_DETAIL_ID
      LEFT JOIN PRI_INFO_LAW_ACT PILA ON PJPDL.LEGAL_ACT_ID = PILA.LAW_ACT_ID
      WHERE PJPD.JAIL_PLAN_ID = ${jailPlanId}
      AND PJPD.IS_ACTIVE = 1
    `;
    const data = await this.dataSource.query(query);
    return data
  }

  //#endregion

  //#region [CARD]

  async getPrisonerCardAll(prisonerId: number) {
    const prisoner = await this.prisonerRepo.findOne({ where: { prisonerId } });
    if (!prisoner) {
      throw new BadRequestException('Not found!');
    }

    const [
      prisonerInfo,
      postureInfo,
      skillList,
      addressList,
      familyList,
      relativeList,
      symptomList,
      bodyAttributeList,
      offenceList,
      oldJailList,
      releaseList,
      movementDepartmentList,
      jailTime,
      prisonerBreak,
    ] = await Promise.all([
      this.getPrisonerCardData(prisonerId),
      this.getPrisonerCardPostureData(prisonerId),
      this.getPrisonerCardSkillListData(prisonerId),
      this.getPrisonerCardAddressListData(prisoner.personId),
      this.getPrisonerCardFamilyListData(prisonerId),
      this.getPrisonerCardRelativeListData(prisonerId),
      this.getPrisonerCardSymptomListData(prisoner.personId),
      this.getPrisonerCardBodyAttributeListData(prisonerId),
      this.getPrisonerCardOffenceListData(prisoner.personId),
      this.getPrisonerCardOldJailListData(prisoner.personId),
      this.getPrisonerCardReleaseListData(prisonerId),
      this.getPrisonerCardMovementDepartmentData(prisonerId),
      this.getPrisonerCardJailPlanJailTimeData(prisonerId),
      this.getPrisonerCardJailPlanBreakData(prisonerId),
    ]);

    const jailPlan: PrisonerCardJailPlanDto = await this.getPrisonerCardJailPlanData(prisonerId);

    let jailPlanDetail = [];
    let jailPlanFine = [];
    let jailPlanFineAsAdditional = [];
    let jailPlanDeprive = [];
    let jailPlanForceWork = [];
    let jailPlanDetailCode = [];
    let jailPlanChangeList = [];
    let jailPlanBonusDays = [];
    let jailPlanAllBonusDays = [];
    let jailPlanHamList = [];
    let jailPlanDtl2 = [];

    if (jailPlan) {
      [
        jailPlanDetail,
        jailPlanFine,
        jailPlanFineAsAdditional,
        jailPlanDeprive,
        jailPlanForceWork,
        jailPlanDetailCode,
        jailPlanChangeList,
        jailPlanBonusDays,
        jailPlanAllBonusDays,
        jailPlanDtl2,
      ] = await Promise.all([
        this.getPrisonerCardJailPlanDetailData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanFineData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanFineAsAdditionalData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanDepriveData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanForceWorkData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanDetailCodeData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanChangeListData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanBonusDaysData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanAllBonusDaysData(jailPlan.jailPlanId),
        this.getPrisonerCardJailPlanDtl2Data(prisonerId),
      ]);

      if (jailPlan.isUnited === 1) {
        jailPlanHamList =
          await this.getPrisonerCardJailPlanHamListData(jailPlan.jailPlanId);
      }
    }

    return {
      prisonerInfo,
      postureInfo,
      skillList,
      addressList,
      familyList,
      relativeList,
      symptomList,
      bodyAttributeList,
      offenceList,

      jailPlan,
      jailPlanDetail,
      jailPlanFine,
      jailPlanFineAsAdditional,
      jailPlanDeprive,
      jailPlanForceWork,
      jailPlanDetailCode,
      jailPlanChangeList,
      jailPlanBonusDays,
      jailPlanAllBonusDays,
      jailPlanHamList,
      jailPlanDtl2,

      oldJailList,
      releaseList,
      movementDepartmentList,
      jailTime,
      prisonerBreak,
    };
  }

  //#region [CARD -> MAIN INFO]

  async getPrisonerCardData(prisonerId: number) {
    if (!prisonerId) return null
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
    const data: PrisonerCardPersonalDto[] = plainToClass(
      PrisonerCardPersonalDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data.length > 0 ? data[0] : null
  }
  async getPrisonerCardPostureData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT HEIGHT, WEIGHT
      FROM PRI_PRISONER_POSTURE PPP
      INNER JOIN PRI_PRISONER_KEY PPK ON PPP.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
      WHERE PPK.PRISONER_ID = ${prisonerId} AND ROWNUM = 1
      ORDER BY PPP.POSTURE_DATE, PPP.CREATED_DATE
    `;
    const data = await this.dataSource.query(query);
    return data.length > 0 ? data[0] : null
  }
  async getPrisonerCardSkillListData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT (PIS.NAME || ' - ' || PPS.DESCRIPTION) AS SKILL
      FROM PRI_PRISONER_SKILL PPS
      INNER JOIN PRI_INFO_SKILL PIS ON PPS.SKILL_ID = PIS.SKILL_ID
      WHERE PRISONER_ID = ${prisonerId}
    `;
    const data = await this.dataSource.query(query);
    return data;
  }
  async getPrisonerCardAddressListData(personId: number) {
    if (!personId) return null
    const query = `
      SELECT 
        PIAT.NAME AS TYPE_NAME, 
        (PIAC.NAME || ' ' || PISD.NAME || ' ' || PA.DESCRIPTION) AS ADDRESS
      FROM PRI_ADDRESS PA
      LEFT JOIN PRI_INFO_ADDRESS_TYPE PIAT ON PA.ADDRESS_TYPE_ID = PIAT.ADDRESS_TYPE_ID
      LEFT JOIN PRI_INFO_AIMAG_CITY PIAC ON PA.AIMAG_ID = PIAC.AIMAG_ID
      LEFT JOIN PRI_INFO_SOUM_DISTRICT PISD ON PA.SOUM_ID = PISD.SOUM_ID
      WHERE PA.PERSON_ID = ${personId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardAddressDto[] = plainToClass(
      PrisonerCardAddressDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardFamilyListData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT 
        PIPT.NAME, 
        (SUBSTR(BP.LAST_NAME, 0, 1) || '.' || BP.FIRST_NAME) AS PERSON_NAME,
        BP.POSITION, 
        BP.STATE_REG_NUMBER, 
        PP.PHONE
      FROM PRI_PARTICIPANT PP
      INNER JOIN PRI_INFO_PARTICIPANT_TYPE PIPT ON PP.PARTICIPANT_TYPE_ID = PIPT.PARTICIPANT_TYPE_ID
      INNER JOIN BASE_PERSON BP ON PP.PERSON_ID = BP.PERSON_ID
      INNER JOIN PRI_PRISONER_KEY PPK ON PP.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
      WHERE PPK.PRISONER_ID = ${prisonerId} AND PP.PARTICIPANT_GROUP_ID = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardFamilyDto[] = plainToClass(
      PrisonerCardFamilyDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardRelativeListData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT 
        PIPT.NAME, 
        (SUBSTR(BP.LAST_NAME, 0, 1) || '.' || BP.FIRST_NAME) AS PERSON_NAME,
        BP.POSITION, 
        BP.STATE_REG_NUMBER, 
        PP.PHONE
      FROM PRI_PARTICIPANT PP
      INNER JOIN PRI_INFO_PARTICIPANT_TYPE PIPT ON PP.PARTICIPANT_TYPE_ID = PIPT.PARTICIPANT_TYPE_ID
      INNER JOIN BASE_PERSON BP ON PP.PERSON_ID = BP.PERSON_ID
      INNER JOIN PRI_PRISONER_KEY PPK ON PP.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
      WHERE PPK.PRISONER_ID = ${prisonerId} AND PP.PARTICIPANT_GROUP_ID = 2
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardFamilyDto[] = plainToClass(
      PrisonerCardFamilyDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardSymptomListData(personId: number) {
    if (!personId) return null
    const query = `
      SELECT 
        PISO.NAME, 
        PISOD.NAME AS DTL_NAME, 
        PIS.NAME AS SYMPTOM_NAME, 
        PPS.DESCRIPTION
      FROM PRI_PERSON_SYMPTOM PPS
      INNER JOIN PRI_INFO_SYMPTOM_ORGAN PISO ON PPS.ORGAN_ID = PISO.ORGAN_ID
      INNER JOIN PRI_INFO_SYMPTOM_ORGAN_DTL PISOD ON PPS.ORGAN_DETAIL_ID = PISOD.ORGAN_DETAIL_ID
      INNER JOIN PRI_INFO_SYMPTOM PIS ON PPS.SYMPTOM_ID = PIS.SYMPTOM_ID
      WHERE PPS.PERSON_ID = ${personId} AND PPS.IS_ACTIVE = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardSymptomDto[] = plainToClass(
      PrisonerCardSymptomDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardBodyAttributeListData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT 
        PBA.NAME, 
        PBAT.NAME AS TYPE_NAME
      FROM PRI_PRISONER_BODY_ATTRIBUTE PPBA
      INNER JOIN PRI_BODY_ATTRIBUTE PBA ON PPBA.BODY_ATTRIBUTE_ID = PBA.BODY_ATTRIBUTE_ID
      INNER JOIN PRI_BODY_ATTRIBUTE_TYPE PBAT ON PPBA.BODY_ATTRIBUTE_TYPE_ID = PBAT.BODY_ATTRIBUTE_TYPE_ID
      WHERE PPBA.PRISONER_ID = ${prisonerId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardBodyAttributeDto[] = plainToClass(
      PrisonerCardBodyAttributeDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardOffenceListData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT 
        TO_CHAR(OFFENCE_DATE, 'yyyy-mm-dd') OFFENCE_DATE, 
        OFFENCE_TYPE_NAME, OFFENCE_ACTION_TYPE_NAME 
      FROM PRI_OFFENCE_ACTION_VIEW 
      WHERE PRISONER_ID = ${prisonerId} ORDER BY OFFENCE_DATE DESC
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardOffenceDto[] = plainToClass(
      PrisonerCardOffenceDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }

  //#endregion

  //#region [CARD -> OTHER INFO]

  async getPrisonerCardOldJailListData(personId: number) {
    if (!personId) return null
    const query = `
      SELECT 
        PPOS.DECISION_YEAR, 
        PILA.CODE, 
        PPOS.SENTENCE_YEARS, 
        PPOS.RELEASED_YEAR, 
        PID.NAME AS DEPARTMENT_NAME, 
        PIRT.NAME AS RELEASE_NAME
      FROM PRI_PRISONER_OLD_SENTENCE PPOS
        LEFT JOIN PRI_INFO_DEPARTMENT PID ON PPOS.DEPARTMENT_ID = PID.DEPARTMENT_ID
        LEFT JOIN PRI_INFO_RELEASE_TYPE PIRT ON PPOS.RELEASE_TYPE_ID = PIRT.RELEASE_TYPE_ID
        LEFT JOIN PRI_PRISONER_OLD_SENTENCE_LAW PPOSL ON PPOS.PRISONER_OLD_SENTENCE_ID = PPOSL.PRISONER_OLD_SENTENCE_ID
        LEFT JOIN PRI_INFO_LAW_ACT PILA ON PPOSL.LAW_ACT_ID = PILA.LAW_ACT_ID
      WHERE PPOS.PERSON_ID = ${personId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardOldJailListDto[] = plainToClass(
      PrisonerCardOldJailListDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardReleaseListData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT 
        PR.RELEASE_DATE, 
        PD.DECISION_NUMBER, 
        PIDT.NAME, 
        PR.DESCRIPTION
      FROM PRI_RELEASE PR
      INNER JOIN PRI_PRISONER_KEY PPK ON PR.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
      INNER JOIN PRI_DECISION PD ON PR.DECISION_ID = PD.DECISION_ID
      INNER JOIN PRI_INFO_DECISION_TYPE PIDT ON PD.DECISION_TYPE_ID = PIDT.DECISION_TYPE_ID
      WHERE PPK.PRISONER_ID = ${prisonerId} AND PR.IS_ROLLEDBACK != 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardReleaseDto[] = plainToClass(
      PrisonerCardReleaseDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardMovementDepartmentData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT
        PMDP.DEPARTURE_DATE ,
        FROM_DEPARTMENT.NAME AS FROM_DEPARTMENT_NAME,
        PMAP.ARRIVAL_DATE ,
        TO_DEPARTMENT.NAME AS TO_DEPARTMENT_NAME, 
        PMD.DESCRIPTION
      FROM PRI_MOVEMENT_DEPARTURE PMD
        INNER JOIN PRI_MOVEMENT_DEPARTURE_PACK PMDP ON PMD.MOVEMENT_DEPARTURE_PACK_ID = PMDP.MOVEMENT_DEPARTURE_PACK_ID
        INNER JOIN PRI_MOVEMENT_ARRIVAL_PACK PMAP ON PMD.MOVEMENT_DEPARTURE_PACK_ID = PMAP.MOVEMENT_DEPARTURE_PACK_ID
        INNER JOIN PRI_PRISONER_KEY PPK ON PMD.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
        LEFT JOIN (SELECT PID.DEPARTMENT_ID, PID.NAME FROM PRI_INFO_DEPARTMENT PID) FROM_DEPARTMENT ON PMDP.FROM_DEPARTMENT_ID = FROM_DEPARTMENT.DEPARTMENT_ID
        LEFT JOIN (SELECT PID.DEPARTMENT_ID, PID.NAME FROM PRI_INFO_DEPARTMENT PID) TO_DEPARTMENT ON PMDP.TO_DEPARTMENT_ID = TO_DEPARTMENT.DEPARTMENT_ID
      WHERE PPK.PRISONER_ID = ${prisonerId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardMovementDepartureDto[] = plainToClass(
      PrisonerCardMovementDepartureDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanJailTimeData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT 
        p.JAIL_PLAN_ID, 
        (p.JAIL_BEGIN_DATE - p.DAYS_IN_CUSTODY) AS JAIL_BEGIN_DATE
      FROM PRI_JAIL_PLAN p
      WHERE p.PRISONER_ID = ${prisonerId} and p.IS_ACTIVE = 1 AND p.JAIL_PLAN_TYPE_ID = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanJailTimeDto[] = plainToClass(
      PrisonerCardJailPlanJailTimeDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanBreakData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT
        TO_CHAR(B.BREAK_DATE, 'yyyy-mm-dd') BREAK_DATE, B.DESCRIPTION, D.NAME DEPARTMENT_NAME,
        WS.WFM_STATUS_NAME, TO_CHAR(B.FOUND_DATE, 'yyyy-mm-dd') FOUND_DATE
      FROM PRI_PRISONER_BREAK B
      LEFT JOIN PRI_PRISONER_KEY K on B.PRISONER_KEY_ID = K.PRISONER_KEY_ID
      LEFT JOIN PRI_INFO_DEPARTMENT D ON K.DEPARTMENT_ID = D.DEPARTMENT_ID
      LEFT JOIN WFM_STATUS WS ON B.WFM_STATUS_ID = WS.WFM_STATUS_ID
      WHERE K.PRISONER_ID = ${prisonerId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanJailBreakDto[] = plainToClass(
      PrisonerCardJailPlanJailBreakDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }

  //#endregion

  //#region [CARD -> CARD JAILPLAN INFO]

  async getPrisonerCardJailPlanData(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT 
        PJP.JAIL_PLAN_ID, 
        PJP.DESCRIPTION, 
        PJP.INTENTION, 
        PJP.IS_UNITED, 
        PICT.NAME AS CRIME_TYPE_NAME, 
        (PID.NAME || ' -н ' || TO_CHAR(PD.DECISION_DATE, 'yyyy-mm-dd') || ' өдрийн ' || PD.DECISION_NUMBER || ' дүгээр ' || PIDT.NAME) AS DECISION
      FROM PRI_JAIL_PLAN PJP
      LEFT JOIN PRI_INFO_CRIME_TYPE PICT ON PJP.CRIME_TYPE_ID = PICT.CRIME_TYPE_ID
      LEFT JOIN PRI_DECISION PD ON PJP.DECISION_ID = PD.DECISION_ID
      LEFT JOIN PRI_INFO_DECISION_TYPE PIDT ON PD.DECISION_TYPE_ID = PIDT.DECISION_TYPE_ID
      LEFT JOIN PRI_INFO_DEPARTMENT PID ON PD.DEPARTMENT_ID = PID.DEPARTMENT_ID
      WHERE PJP.PRISONER_ID = ${prisonerId} AND PJP.JAIL_PLAN_TYPE_ID = 1 AND PJP.IS_ACTIVE = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanDto[] = plainToClass(
      PrisonerCardJailPlanDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data.length > 0 ? data[0] : null
  }
  async getPrisonerCardJailPlanDetailData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT PJPD.JAIL_YEARS, PJPD.JAIL_MONTHS, PJPD.JAIL_DAYS
      FROM PRI_JAIL_PLAN_DETAIL PJPD
      WHERE PJPD.JAIL_PLAN_ID = ${jailPlanId} AND PJPD.IS_ACTIVE = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanDetailDto[] = plainToClass(
      PrisonerCardJailPlanDetailDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data
  }
  async getPrisonerCardJailPlanFineData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT
        F.JAIL_PLAN_ID,
        F.FINE_AMOUNT,
        F.DESCRIPTION,
        FT.NAME FINE_TYPE_NAME
      FROM PRI_JAIL_PLAN_FINE F
        LEFT JOIN PRI_INFO_FINE_TYPE FT ON F.FINE_TYPE_ID = FT.FINE_TYPE_ID
      WHERE F.IS_ACTIVE = 1 AND F.FINE_TYPE_ID = 1 AND F.JAIL_PLAN_ID = ${jailPlanId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanFineDto[] = plainToClass(
      PrisonerCardJailPlanFineDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanFineAsAdditionalData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT
        F.JAIL_PLAN_ID,
        F.FINE_AMOUNT,
        F.DESCRIPTION,
        FT.NAME FINE_TYPE_NAME
      FROM PRI_JAIL_PLAN_FINE F
        LEFT JOIN PRI_INFO_FINE_TYPE FT ON F.FINE_TYPE_ID = FT.FINE_TYPE_ID
      WHERE F.IS_ACTIVE = 1 AND F.FINE_TYPE_ID = 2 AND F.JAIL_PLAN_ID = ${jailPlanId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanFineDto[] = plainToClass(
      PrisonerCardJailPlanFineDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanDepriveData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT PIDT.NAME, PJPD.DESCRIPTION
      FROM PRI_JAIL_PLAN_DEPRIVE PJPD
      INNER JOIN PRI_INFO_DEPRIVE_TYPE PIDT ON PJPD.DEPRIVE_TYPE_ID = PIDT.DEPRIVE_TYPE_ID
      WHERE PJPD.JAIL_PLAN_ID = ${jailPlanId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanDepriveDto[] = plainToClass(
      PrisonerCardJailPlanDepriveDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanForceWorkData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT
        WORK_HOURS,
        DESCRIPTION
      FROM PRI_JAIL_PLAN_FORCE_WORK
      WHERE IS_ACTIVE = 1 AND JAIL_PLAN_ID = ${jailPlanId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanForceWorkDto[] = plainToClass(
      PrisonerCardJailPlanForceWorkDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanDetailCodeData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT PILA.CODE
      FROM PRI_JAIL_PLAN_DETAIL PJPD
      LEFT JOIN PRI_JAIL_PLAN_DETAIL_LAW PJPDL ON PJPD.JAIL_PLAN_DETAIL_ID = PJPDL.JAIL_PLAN_DETAIL_ID
      LEFT JOIN PRI_INFO_LAW_ACT PILA ON PJPDL.LEGAL_ACT_ID = PILA.LAW_ACT_ID
      WHERE PJPD.JAIL_PLAN_ID = ${jailPlanId} AND PJPD.IS_ACTIVE = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanDetailDto[] = plainToClass(
      PrisonerCardJailPlanDetailDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanChangeListData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT
        JPC.JAIL_PLAN_CHANGE_ID, JPC.JAIL_PLAN_ID, JPCT.NAME, TO_CHAR(JPC.BEGIN_DATE, 'yyyy-mm-dd') BEGIN_DATE, JPC.DESCRIPTION,
        TO_CHAR(DEC.DECISION_DATE, 'yyyy-mm-dd') DECISION_DATE, DEC.DECISION_NUMBER, DT.NAME DECISION_TYPE_NAME
      FROM PRI_JAIL_PLAN_CHANGE JPC
        INNER JOIN PRI_JAIL_PLAN_CHANGE_TYPE JPCT ON JPC.JAIL_PLAN_CHANGE_TYPE_ID = JPCT.JAIL_PLAN_CHANGE_TYPE_ID
        LEFT JOIN PRI_DECISION DEC ON JPC.DECISION_ID = DEC.DECISION_ID
        LEFT JOIN PRI_INFO_DECISION_TYPE DT ON DEC.DECISION_TYPE_ID = DT.DECISION_TYPE_ID
      WHERE JPC.JAIL_PLAN_ID = ${jailPlanId}
      ORDER BY JPC.CREATED_DATE ASC
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanChangeListDto[] = plainToClass(
      PrisonerCardJailPlanChangeListDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    const queryJailPlanChangeDtlList = `
      SELECT
        JPD.JAIL_PLAN_DETAIL_ID,
        JPD.JAIL_YEARS,
        JPD.JAIL_MONTHS,
        JPD.JAIL_DAYS,
        IDR.NAME AS DEPARTMENT_REGIME_NAME
      FROM PRI_JAIL_PLAN_CHANGE JPC
      INNER JOIN PRI_JAIL_PLAN_CHANGE_DETAIL JPCD ON JPC.JAIL_PLAN_CHANGE_ID = JPCD.JAIL_PLAN_CHANGE_ID
      INNER JOIN PRI_JAIL_PLAN_DETAIL JPD ON JPCD.JAIL_PLAN_DETAIL_ID = JPD.JAIL_PLAN_DETAIL_ID
      INNER JOIN PRI_INFO_DEPARTMENT_REGIME IDR ON JPD.DEPARTMENT_REGIME_ID = IDR.DEPARTMENT_REGIME_ID
      WHERE JPCD.IS_OLD = 1 AND JPC.JAIL_PLAN_CHANGE_ID = 
    `;
    for (const item of data) {
      const jailPlanChangeId = item['jailPlanChangeId'];
      const resultChangeDtl = await this.dataSource.query(queryJailPlanChangeDtlList + jailPlanChangeId);
      const jailPlanChangeDtl: PrisonerCardJailPlanDetailDto[] = plainToClass(
        PrisonerCardJailPlanDetailDto,
        resultChangeDtl as object[],
        { excludeExtraneousValues: true },
      );
      item['dtl'] = jailPlanChangeDtl;
    }
    return data;
  }
  async getPrisonerCardJailPlanBonusDaysData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT
        PPBD.DATE_OF_BONUS, PPBD.DECISION_NUMBER, PPBD.DAYS
      FROM 
        PRI_PRISONER_BONUS_DAY PPBD
        INNER JOIN PRI_PRISONER_KEY PPK ON PPBD.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
      WHERE PPBD.BONUS_DAY_TYPE_ID = 1
        AND PPBD.JAIL_PLAN_ID = ${jailPlanId}
      ORDER BY PPBD.DATE_OF_BONUS DESC
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardBonusDayDto[] = plainToClass(
      PrisonerCardBonusDayDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanAllBonusDaysData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT PPBD.BONUS_DAY_TYPE_ID, PPBD.DATE_OF_BONUS, PPBD.DECISION_NUMBER, PPBD.DAYS
      FROM PRI_PRISONER_BONUS_DAY PPBD
      INNER JOIN PRI_PRISONER_KEY PPK ON PPBD.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
      WHERE PPBD.JAIL_PLAN_ID = ${jailPlanId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardBonusDayDto[] = plainToClass(
      PrisonerCardBonusDayDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanHamListData(jailPlanId: number) {
    if (!jailPlanId) return null
    const query = `
      SELECT
        PP.JAIL_PLAN_PARTICIPANT_ID, PP.JAIL_PLAN_ID, PP.PERSON_ID,
        BP.STATE_REG_NUMBER, BP.FIRST_NAME, BP.LAST_NAME, D.NAME DEPARTMENT_NAME
      FROM PRI_JAIL_PLAN_PARTICIPANT PP
        LEFT JOIN BASE_PERSON BP ON PP.PERSON_ID = BP.PERSON_ID
        LEFT JOIN PRI_PRISONER P ON BP.PERSON_ID = P.PERSON_ID
        LEFT JOIN PRI_PRISONER_KEY PK ON P.PRISONER_ID = PK.PRISONER_ID AND PK.END_DATE IS NULL
        LEFT JOIN PRI_INFO_DEPARTMENT D ON PK.DEPARTMENT_ID = D.DEPARTMENT_ID
      WHERE PP.PARTICIPANT_TYPE_ID = 123 AND PP.JAIL_PLAN_ID = ${jailPlanId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanHamDto[] = plainToClass(
      PrisonerCardJailPlanHamDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }
  async getPrisonerCardJailPlanDtl2Data(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT
        R.NAME REGIME_NAME, D.*
      FROM PRI_JAIL_PLAN_DETAIL D
        LEFT JOIN PRI_JAIL_PLAN JP ON D.JAIL_PLAN_ID = JP.JAIL_PLAN_ID
        LEFT JOIN PRI_INFO_DEPARTMENT_REGIME R ON D.DEPARTMENT_REGIME_ID = R.DEPARTMENT_REGIME_ID
      WHERE JP.IS_ACTIVE = 1
        AND JP.JAIL_PLAN_TYPE_ID = 1
        AND D.IS_ACTIVE = 1
        AND JP.PRISONER_ID = ${prisonerId}
    `;
    const result = await this.dataSource.query(query);
    const data: PriJailPanDetailDto[] = plainToClass(
      PriJailPanDetailDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }

  //#endregion

  //#endregion

  //#region [MAP]

  getBasePersonDataFromDTO(dto: CreatePrisonerCardPersonalInfoDto) {
    return {
      personId: dto.personId,
      stateRegNumber: dto.stateRegNumber,
      lastName: dto.lastName,
      firstName: dto.firstName,
      dateOfBirth: dto.dateOfBirth,
      profession: dto.profession,
      position: dto.position,
      familyMemberCount: dto.familyMemberCount,
      birthAimagId: dto.birthAimagId,
      birthSoumId: dto.birthSoumId,
      administrationAimagId: dto.birthAimagId,
      administrationSoumId: dto.birthSoumId,
      administrationAddress: dto.administrationAddress,
      nationalityId: dto.nationalityId,
      educationId: dto.educationId,
    };
  }

  //#endregion

  //#region [/admin/pri/prisoner/[id] -> GET]



  //#endregion

}

