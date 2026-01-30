import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { PriPrisoner } from 'src/entity/pri/prisoner/priPrisoner';
import { PriPrisonerKey } from 'src/entity/pri/prisoner/PriPrisonerKey';
import { PrisonerCardJailPlanDto } from 'src/dto/pri/prisoner/card/jailPlan/jailPlan.dto';
import { PrisonerCardPersonalDetentionDto } from 'src/dto/pri/prisoner/card/detention/personal.detention.dto';
import { PrisonerCardDetentionProsecutorDto } from 'src/dto/pri/prisoner/card/detention/detention.prosecutor.dto';
import { PrisonerCardJailPlanExtentionDto } from 'src/dto/pri/prisoner/card/jailPlan/jailPlan.extension.dto';
import { PrisonerCardDetentionHergiinHolbogdogchDto } from 'src/dto/pri/prisoner/card/detention/detention.hergiin.holbogodgch.dto';
import { PrisonerCardDetentionInterrogationDto } from 'src/dto/pri/prisoner/card/detention/detention.interrogation.dto';
import { PrisonerCardDetentionOfficerMeetingsDto } from 'src/dto/pri/prisoner/card/detention/detention.officer.meetings.dto';

@Injectable()
export class PriDetentionService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPrisoner)
    private prisonerRepo: Repository<PriPrisoner>,
    @InjectRepository(PriPrisonerKey)
    private prisonerKeyRepo: Repository<PriPrisonerKey>,
  ) {}

  //#region [LIST]

  //#endregion

  //#region [API]

  async findPrisonerDetentionCard(prisonerId: number, user: any) {
    if (!prisonerId) {
      throw new BadRequestException("Хүсэлт тодорхойгүй!");
    }
    const data = await this.getPrisonerDetentionCardAll(prisonerId)
    return data;
  }
  async getPrisonerDetentionCardAll(prisonerId: number) {
    const prisoner = await this.prisonerRepo.findOne({ where: { prisonerId } });
    if (!prisoner) {
      throw new BadRequestException('Not found!');
    }

    const [
      oldSentenceCount,
    ] = await Promise.all([
      this.getPrisonerCardOldSentenceCount(prisonerId),
    ]);

    let detention = null;

    const prisonerKey = await this.prisonerKeyRepo
      .createQueryBuilder('ppk')
      .where('ppk.PRISONER_ID = :prisonerId', { prisonerId })
      .andWhere('ppk.END_DATE IS NULL')
      .getOne();
    if (!prisonerKey) {
      return { detention, oldSentenceCount, };
    }

    let prosecutor = null
    let investigator = null
    let jailPlanExtention = []
    let hergiinHolbogdogch = []
    let prisonerStatusYaltan = null
    let interrogations = []
    let postureInfo = null
    let officerMeetings = []

    detention = await this.getPrisonerCardDetentionMain(prisonerKey.prisonerKeyId);
    if (detention) {
      [
        postureInfo,
        prosecutor,
        investigator,
        jailPlanExtention,
        prisonerStatusYaltan,
        interrogations,
        officerMeetings,
      ] = await Promise.all([
        this.getPrisonerCardDetentionPostureData(detention.detentionId),
        this.getPrisonerCardProsecutor(detention.detentionId),
        this.getPrisonerCardInvestigator(detention.detentionId),
        this.getPrisonerCardJailPlanExtention(prisonerId),
        this.getPrisonerCardStatusYaltan(detention.detentionId),
        this.getPrisonerCardInterrogations(detention.detentionId),
        this.getPrisonerCardOfficerMeetings(detention.detentionId),
      ]);
      if (detention.detention) {
        hergiinHolbogdogch = await this.getPrisonerCardHergiinHolbogdogch(prisonerId, detention.caseNumber);
      }
    }

    return {
      detention,
      oldSentenceCount,
      prosecutor,
      investigator,
      jailPlanExtention,
      hergiinHolbogdogch,
      postureInfo,
      prisonerStatusYaltan,
      interrogations,
      officerMeetings,
    };
  }

  //#endregion

  //#region [CARD -> DETENTION - Урьдчилан хоригдогчийн карт]

  async getPrisonerCardDetentionMain(prisonerKeyId: number) {
    if (!prisonerKeyId) return null
    const query = `
      SELECT 
        BP.FAMILY_NAME, BP.LAST_NAME, BP.FIRST_NAME, IGT.GENDER_NAME, 
        (PIAC.NAME || ' - ' || PISD.NAME) AS BIRTH_PLACE,
        (PIAC2.NAME || ' - ' || PISD2.NAME) AS ADMINISTRATION_PLACE,
        FLOOR((sysdate - BP.DATE_OF_BIRTH) / 365.242199) AS AGE,
        BP.DATE_OF_BIRTH, BP.STATE_REG_NUMBER, RC.COUNTRY_NAME, PIN.NAME AS ORIGIN_NAME, PID.NAME AS DEPARTMENT_NAME,
        PIE.NAME AS EDUCATION_NAME, BP.PROFESSION, BP.POSITION, PIMS.NAME AS MARITAL_STATUS, BP.FAMILY_MEMBER_COUNT, TO_CHAR(JP.JAIL_BEGIN_DATE, 'yyyy-mm-dd') ACTION_DATE,
        LA.CODE LAW_ACT_CODE, DET.CLOTHES_DETAIL, PPK.DETENTION_ID, DET.CASE_NUMBER,
        DOD.NAME DO_DEPARTMENT_NAME, DO.POSITION DO_POSITION, DO.FIRST_NAME DO_FIRST_NAME, DO.PHONE DO_PHONE
      FROM PRI_PRISONER_KEY PPK
        INNER JOIN PRI_PRISONER PP ON PPK.PRISONER_ID = PP.PRISONER_ID
        INNER JOIN BASE_PERSON BP ON PP.PERSON_ID = BP.PERSON_ID
        LEFT JOIN PRI_DETENTION DET ON PPK.DETENTION_ID = DET.DETENTION_ID
        LEFT JOIN PRI_OFFICER DO ON DET.DETENTION_OFFICER_ID = DO.OFFICER_ID
        LEFT JOIN PRI_INFO_DEPARTMENT DOD ON DO.DEPARTMENT_ID = DOD.DEPARTMENT_ID
        LEFT JOIN PRI_JAIL_PLAN JP ON PP.PRISONER_ID = JP.PRISONER_ID AND JP.IS_ACTIVE = 1
        LEFT JOIN PRI_INFO_LAW_ACT LA ON DET.LEGAL_ACT_ID = LA.LAW_ACT_ID
        LEFT JOIN PRI_INFO_DEPARTMENT PID ON PPK.DEPARTMENT_ID = PID.DEPARTMENT_ID
        LEFT JOIN REF_COUNTRY RC ON BP.COUNTRY_ID = RC.COUNTRY_ID
        LEFT JOIN PRI_INFO_NATIONALITY PIN ON BP.NATIONALITY_ID = PIN.NATIONALITY_ID
        LEFT JOIN INFO_GENDER_TYPE IGT ON BP.GENDER_ID = IGT.GENDER_ID
        LEFT JOIN PRI_INFO_EDUCATION PIE ON BP.EDUCATION_ID = PIE.EDUCATION_ID
        LEFT JOIN PRI_INFO_MARITAL_STATUS PIMS ON BP.MARITAL_STATUS_ID = PIMS.MARITAL_STATUS_ID
        LEFT JOIN PRI_INFO_AIMAG_CITY PIAC ON BP.BIRTH_AIMAG_ID = PIAC.AIMAG_ID
        LEFT JOIN PRI_INFO_SOUM_DISTRICT PISD ON BP.BIRTH_SOUM_ID = PISD.SOUM_ID
        LEFT JOIN PRI_INFO_AIMAG_CITY PIAC2 ON BP.ADMINISTRATION_AIMAG_ID = PIAC2.AIMAG_ID
        LEFT JOIN PRI_INFO_SOUM_DISTRICT PISD2 ON BP.ADMINISTRATION_SOUM_ID = PISD2.SOUM_ID
        WHERE PPK.PRISONER_KEY_ID = ${prisonerKeyId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardPersonalDetentionDto[] = plainToClass(
      PrisonerCardPersonalDetentionDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data.length > 0 ? data[0] : null
  }

  async getPrisonerCardOldSentenceCount(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT COUNT(*) CNT FROM PRI_PRISONER_OLD_SENTENCE
      WHERE PRISONER_ID = ${prisonerId}
    `;
    const data = await this.dataSource.query(query);
    return data.length > 0 ? data[0] : null
  }

  async getPrisonerCardProsecutor(detentionId: number) {
    if (!detentionId) return null
    const query = `
      SELECT
        PO.CASE_OFFICER_TYPE_ID, POT.NAME OFFICER_TYPE_NAME,
        O.FIRST_NAME, O.PHONE, O.POSITION, D.NAME DEPARTMENT_NAME
      FROM PRI_PRISONER_OFFICER PO
      LEFT JOIN PRI_INFO_CASE_OFFICER_TYPE POT ON PO.CASE_OFFICER_TYPE_ID = POT.CASE_OFFICER_TYPE_ID
      LEFT JOIN PRI_OFFICER O ON PO.OFFICER_ID = O.OFFICER_ID
      LEFT JOIN PRI_INFO_DEPARTMENT D ON O.DEPARTMENT_ID = D.DEPARTMENT_ID
      LEFT JOIN PRI_PRISONER_KEY K ON PO.PRISONER_KEY_ID = K.PRISONER_KEY_ID
      WHERE
        PO.CASE_OFFICER_TYPE_ID = 1 AND
        PO.IS_ACTIVE = 1 AND
        K.DETENTION_ID = ${detentionId} AND
        ROWNUM = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardDetentionProsecutorDto[] = plainToClass(
      PrisonerCardDetentionProsecutorDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data.length > 0 ? data[0] : null
  }

  async getPrisonerCardInvestigator(detentionId: number) {
    if (!detentionId) return null
    const query = `
      SELECT
        PO.CASE_OFFICER_TYPE_ID, POT.NAME OFFICER_TYPE_NAME,
        O.FIRST_NAME, O.PHONE, O.POSITION, D.NAME DEPARTMENT_NAME
      FROM PRI_PRISONER_OFFICER PO
      LEFT JOIN PRI_INFO_CASE_OFFICER_TYPE POT ON PO.CASE_OFFICER_TYPE_ID = POT.CASE_OFFICER_TYPE_ID
      LEFT JOIN PRI_OFFICER O ON PO.OFFICER_ID = O.OFFICER_ID
      LEFT JOIN PRI_INFO_DEPARTMENT D ON O.DEPARTMENT_ID = D.DEPARTMENT_ID
      LEFT JOIN PRI_PRISONER_KEY K ON PO.PRISONER_KEY_ID = K.PRISONER_KEY_ID
      WHERE
        PO.CASE_OFFICER_TYPE_ID = 2 AND
        PO.IS_ACTIVE = 1 AND
        K.DETENTION_ID = ${detentionId} AND
        ROWNUM = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardDetentionProsecutorDto[] = plainToClass(
      PrisonerCardDetentionProsecutorDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data.length > 0 ? data[0] : null
  }

  async getPrisonerCardJailPlanExtention(prisonerId: number) {
    if (!prisonerId) return null
    const query = `
      SELECT PJP.JAIL_PLAN_ID, PJP.DESCRIPTION, PJP.INTENTION, PJP.IS_UNITED, PICT.NAME AS CRIME_TYPE_NAME, 
        (PID.NAME || ' -н ' || TO_CHAR(PD.DECISION_DATE, 'yyyy-mm-dd') || ' өдрийн ' || PD.DECISION_NUMBER || ' дүгээр ' || PIDT.NAME) AS DECISION
      FROM PRI_JAIL_PLAN PJP
      LEFT JOIN PRI_INFO_CRIME_TYPE PICT ON PJP.CRIME_TYPE_ID = PICT.CRIME_TYPE_ID
      LEFT JOIN PRI_DECISION PD ON PJP.DECISION_ID = PD.DECISION_ID
      LEFT JOIN PRI_INFO_DECISION_TYPE PIDT ON PD.DECISION_TYPE_ID = PIDT.DECISION_TYPE_ID
      LEFT JOIN PRI_INFO_DEPARTMENT PID ON PD.DEPARTMENT_ID = PID.DEPARTMENT_ID
      WHERE PJP.PRISONER_ID = ${prisonerId}
      AND PJP.JAIL_PLAN_TYPE_ID = 3
      AND PJP.IS_ACTIVE = 1
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardJailPlanDto[] = plainToClass(
      PrisonerCardJailPlanDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    if (data.length === 0) return []
    
    const queryExtension = `
      SELECT
        JP.JAIL_BEGIN_DATE, JP.JAIL_END_DATE, DEC.EMPLOYEE_NAME, DEC.DECISION_DATE, DEC.DECISION_NUMBER, D.NAME DEPARTMENT_NAME
      FROM PRI_JAIL_PLAN JP
      LEFT JOIN PRI_JAIL_PLAN_DETAIL JPD ON JP.JAIL_PLAN_ID = JPD.JAIL_PLAN_ID
      LEFT JOIN PRI_DECISION DEC ON JP.DECISION_ID = DEC.DECISION_ID
      LEFT JOIN PRI_INFO_DEPARTMENT D ON DEC.DEPARTMENT_ID = D.DEPARTMENT_ID
      START WITH JP.JAIL_PLAN_ID = ${data[0].jailPlanId}
      CONNECT BY JP.JAIL_PLAN_ID = PRIOR JP.PARENT_JAIL_PLAN_ID
      ORDER BY JP.JAIL_BEGIN_DATE
    `;
    const resultExtension = await this.dataSource.query(queryExtension);
    const dataExtension: PrisonerCardJailPlanExtentionDto[] = plainToClass(
      PrisonerCardJailPlanExtentionDto,
      resultExtension as object[],
      { excludeExtraneousValues: true },
    );
    return dataExtension
  }

  async getPrisonerCardHergiinHolbogdogch(prisonerId: number, caseNumber: string) {
    if (!prisonerId || !caseNumber) return []
    const query = `
      SELECT DISTINCT
        D.CASE_NUMBER, BP.STATE_REG_NUMBER, BP.FIRST_NAME, C.CELL_NUMBER,
        D.DETENTION_ID
      FROM PRI_PRISONER_KEY K
      LEFT JOIN PRI_DETENTION D ON K.DETENTION_ID = D.DETENTION_ID
      INNER JOIN PRI_JAIL_PLAN JP ON K.PRISONER_ID = JP.PRISONER_ID
      INNER JOIN PRI_JAIL_PLAN_PARTICIPANT PR ON JP.JAIL_PLAN_ID = PR.JAIL_PLAN_ID
      LEFT JOIN PRI_PRISONER P ON JP.PRISONER_ID = P.PRISONER_ID
      INNER JOIN BASE_PERSON BP ON PR.PERSON_ID = BP.PERSON_ID
      LEFT JOIN PRI_PRISON_CELL C ON K.PRISON_CELL_ID = C.PRISON_CELL_ID
      WHERE K.END_DATE IS NULL 
      AND _NUMBER = '${caseNumber}' 
      AND K.PRISONER_ID = ${prisonerId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardDetentionHergiinHolbogdogchDto[] = plainToClass(
      PrisonerCardDetentionHergiinHolbogdogchDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }

  async getPrisonerCardDetentionPostureData(detentionId: number) {
    if (!detentionId) return null
    const query = `
      SELECT HEIGHT, WEIGHT, MV.NAME MENTALITY, USED_DRUG_OR_ALCOHOL, DRUG_OR_ALCOHOL_INFO, HAS_OPEN_WOUND, OPEN_WOUND_INFO
      FROM PRI_PRISONER_POSTURE PPP
      INNER JOIN PRI_PRISONER_KEY PPK ON PPP.PRISONER_KEY_ID = PPK.PRISONER_KEY_ID
      LEFT JOIN PRI_INFO_MEDICAL_VALUE MV ON PPP.MENTALITY_VALUE_ID = MV.MEDICAL_VALUE_ID
        WHERE PPK.DETENTION_ID = ${detentionId}
      AND ROWNUM = 1
        ORDER BY PPP.POSTURE_DATE, PPP.CREATED_DATE
    `;
    const data = await this.dataSource.query(query);
    return data.length > 0 ? data[0] : null
  }

  async getPrisonerCardStatusYaltan(detentionId: number) {
    if (!detentionId) return null
    const query = `
      SELECT WFM_STATUS_ID, STATUS_DATE
      FROM (
        SELECT
          PS.WFM_STATUS_ID, MIN(PS.STATUS_DATE) STATUS_DATE
        FROM
          PRI_PRISONER_STATUS PS
          LEFT JOIN PRI_PRISONER_KEY K ON PS.PRISONER_KEY_ID = K.PRISONER_KEY_ID
        WHERE
          K.DETENTION_ID = ${detentionId} AND PS.WFM_STATUS_ID IN (100105, 100106)
        GROUP BY
          PS.WFM_STATUS_ID
        ORDER BY PS.WFM_STATUS_ID
      )
      WHERE ROWNUM = 1
    `;
    const data = await this.dataSource.query(query);
    return data.length > 0 ? data[0] : null;
  }

  async getPrisonerCardInterrogations(detentionId: number) {
    if (!detentionId) return null
    const query = `
      SELECT
        I.*, O.LAST_NAME, O.FIRST_NAME, D.NAME DEPARTMENT_NAME
      FROM
        PRI_PRISONER_INTERROGATION I
        LEFT JOIN PRI_OFFICER O ON I.OFFICER_ID = O.OFFICER_ID
        LEFT JOIN PRI_INFO_DEPARTMENT D ON O.DEPARTMENT_ID = D.DEPARTMENT_ID
        LEFT JOIN PRI_PRISONER_KEY K ON I.PRISONER_KEY_ID = K.PRISONER_KEY_ID
      WHERE K.DETENTION_ID = ${detentionId}
      ORDER BY
        I.BOOK_DATE
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardDetentionInterrogationDto[] = plainToClass(
      PrisonerCardDetentionInterrogationDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }

  async getPrisonerCardOfficerMeetings(detentionId: number) {
    if (!detentionId) return null
    const query = `
      SELECT
        M.MEETING_DATE, K.DETENTION_ID, K.PRISONER_ID, O.LAST_NAME, O.FIRST_NAME, O.ID_NUMBER,
        MT.NAME MEETING_TYPE_NAME, M.START_TIME, M.END_TIME
      FROM
      PRI_OFFICER_MEETING M
        LEFT JOIN PRI_PRISONER_KEY K ON M.PRISONER_KEY_ID = K.PRISONER_KEY_ID
        LEFT JOIN PRI_OFFICER O ON M.OFFICER_ID = O.OFFICER_ID
        LEFT JOIN PRI_INFO_OFFICER_MEETING_TYPE MT ON M.OFFICER_MEETING_TYPE_ID = MT.OFFICER_MEETING_TYPE_ID
      WHERE K.DETENTION_ID = ${detentionId}
    `;
    const result = await this.dataSource.query(query);
    const data: PrisonerCardDetentionOfficerMeetingsDto[] = plainToClass(
      PrisonerCardDetentionOfficerMeetingsDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return data;
  }

  //#endregion

}

