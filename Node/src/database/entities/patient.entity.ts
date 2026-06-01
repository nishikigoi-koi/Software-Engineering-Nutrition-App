import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { UserEntity } from "./user.entity.ts";
import { DietaryRestrictionEntity } from "./dietaryRestriction.entity.ts";
import { MedicalConditionEntity } from "./medicalConditions.entity.ts";


@Entity({ name: "patients" })
export class PatientEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.patients, { cascade: true })
    @JoinColumn({ name: "userId" })
    user: UserEntity;

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

    @Column()
    weight: number;

    @Column()
    height: number;

    @Column()
    activityLevel: string;

    @ManyToMany(() => DietaryRestrictionEntity, (DietaryRestrictionEntity) => DietaryRestrictionEntity.patients)
    dietaryRestrictions: DietaryRestrictionEntity[];

    @ManyToMany(() => MedicalConditionEntity, (MedicalConditionEntity) => MedicalConditionEntity.patients)
    medicalConditions: MedicalConditionEntity[];
}