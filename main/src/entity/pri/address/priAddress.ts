import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { BasePerson } from 'src/entity/base/basePerson';
import { PriInfoAddressType } from 'src/entity/info/priInfoAddressType';
import { PriInfoAimagCity } from 'src/entity/info/priInfoAimagCity';
import { PriInfoSoumDistrict } from 'src/entity/info/priInfoSoumDistrict';
import { PriInfoBagKhoroo } from 'src/entity/info/priInfoBagKhoroo';
import { RefCountry } from 'src/entity/ref/refCountry';

@Entity('PRI_ADDRESS')
export class PriAddress{

  @PrimaryGeneratedColumn({ name: "ADDRESS_ID" })
  addressId: number;

  @Column({ name: "ADDRESS_TYPE_ID" })
  addressTypeId: number;

  @OneToOne(() => PriInfoAddressType, (at) => at.addressTypeId)
  @JoinColumn({name: 'ADDRESS_TYPE_ID'})
  addressType: PriInfoAddressType;
  
  @Column({ name: "AIMAG_ID" })
  aimagId: number;

  @OneToOne(() => PriInfoAimagCity, (ac) => ac.aimagId)
  @JoinColumn({name: 'AIMAG_ID'})
  aimag: PriInfoAimagCity;

  @Column({ name: "SOUM_ID" })
  soumId: number;

  @OneToOne(() => PriInfoSoumDistrict, (sd) => sd.soumId)
  @JoinColumn({name: 'SOUM_ID'})
  soum: PriInfoSoumDistrict;

  @Column({ name: "BAG_ID" })
  bagId: number;

  @OneToOne(() => PriInfoBagKhoroo, (b) => b.bagId)
  @JoinColumn({name: 'BAG_ID'})
  bag: PriInfoBagKhoroo;

  @Column({ name: "DESCRIPTION" })
  description: string;

  @Column({ name: "PERSON_ID" })
  personId: number;

  @OneToOne(() => BasePerson, (np) => np.personId)
  @JoinColumn({name: 'PERSON_ID'})
  person: BasePerson;

  @Column({ name: "COUNTRY_ID" })
  countryId: number;

  @OneToOne(() => RefCountry, (rc) => rc.countryId)
  @JoinColumn({name: 'COUNTRY_ID'})
  country: RefCountry;

  @Column({ name: "COMPANY_ID" })
  companyId: number;

  constructor(item: Partial<PriAddress>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      addressId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      'addressType.name': { header: 'Хаягийн төрөл', type: 'ref', sortable: false, filterable: true, width: 'w-16' },
      'aimag.name': { header: 'Аймаг/Хот', type: 'ref', sortable: false, filterable: true, width: 'w-16' },
      'soum.name': { header: 'Сум/Дүүрэг', type: 'ref', sortable: false, filterable: true, width: 'w-16' },
      'bag.name': { header: 'Баг/Хороо', type: 'ref', sortable: false, filterable: true, width: 'w-16' },
      description: { header: 'Нэмэлт', type: 'string', sortable: true, filterable: true, width: 'w-48' },
    };
  }
}