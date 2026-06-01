import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity.ts";


@Entity({ name: "patients" })
export class PatientEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.patients)
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    birthDate: string;

    @Column()
    gender: string;

    @Column()
    ethnicity: string;

    @Column()
    weight: number;

    @Column()
    height: number;

    @Column()
    activityLevel: string;
}