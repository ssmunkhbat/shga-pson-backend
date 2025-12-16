import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserKey } from './userKey.entity';

export class EntBase {
    @Column({ name: "CREATED_DATE", default: new Date() })
    createdDate: Date;

    @Column({ name: "CREATED_USER_ID" })
    createdUserId: number;

    @Column({ name: "MODIFIED_DATE" })
    modifiedDate: Date;

    @Column({ name: "MODIFIED_USER_ID" })
    modifiedUserId: number;

    @Column({ name: "IS_ACTIVE", default: true })
    isActive: boolean;

    @OneToOne(() => UserKey, (user) => user.id)
    @JoinColumn({name: 'CREATED_USER_ID'})
    createdUser: UserKey


    @OneToOne(() => UserKey, (user) => user.id)
    @JoinColumn({name: 'MODIFIED_USER_ID'})
    modifiedUser: UserKey
}