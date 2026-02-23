import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { UmSystemUser } from './um/um-system-user.entity';

@Entity('FILE_ATTACH')
export class FileAttach {

  @PrimaryGeneratedColumn({ name: "ATTACH_ID" })
  attachId: number;

  @Column({name: 'ATTACH_NAME'})
  attachName: string;

  @Column({name: 'ATTACH'})
  attach: string;

  @Column({name: 'FILE_EXTENSION'})
  fileExtension: string;

  @Column({name: 'FILE_SIZE'})
  fileSize: number;

  @Column({name: 'FOLDER_ID'})
  folderId: number;

  @Column({name: 'SYSTEM_ID'})
  systemId: number;

  @Column({name: 'ATTACH_THUMB'})
  attachThumb: string;

  @Column({name: 'CREATED_DATE'})
  createdDate: Date;

  @Column({ name: "CREATED_USER_ID" })
  createdUserId: number;

  @OneToOne(() => UmSystemUser, (user) => user.userId)
  @JoinColumn({name: 'CREATED_USER_ID'})
  createdUser: UmSystemUser;

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      attachId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      attachName: { header: 'Файлын нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      attach: { header: 'Файл', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      fileSize: { header: 'Хэмжээ', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: false, filterable: true, width: 'w-48' },
    };
  }
}