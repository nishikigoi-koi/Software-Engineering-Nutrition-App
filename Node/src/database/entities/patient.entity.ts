import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, ManyToMany, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity.ts";
import { PatientRestrictionEntity } from "./patientRestriction.entity.ts";
import { PatientConditionEntity } from "./patientConditions.entity.ts";
import { FoodLogEntity } from "./foodLog.entity.ts";


@Entity({ name: "patients" })
export class PatientEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.patients, { cascade: true })
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @Column()
    userId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    birthDate: string;

    @Column()
    gender: string;

    @Column()
    ethnicity: string;

    @Column({ type: "float" })
    weight: number;

    @Column({ type: "float" })
    height: number;

    @Column()
    activityLevel: string;

    @OneToMany(() => PatientRestrictionEntity, (PatientRestrictionEntity) => PatientRestrictionEntity.patients)
    patientRestrictions: PatientRestrictionEntity[];

    @OneToMany(() => PatientConditionEntity, (PatientConditionEntity) => PatientConditionEntity.patients)
    patientConditions: PatientConditionEntity[];

    @OneToMany(() => FoodLogEntity, (FoodLogEntity) => FoodLogEntity.patient)
    foodLogs: FoodLogEntity[];
}