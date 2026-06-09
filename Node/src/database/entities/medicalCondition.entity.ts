import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, OneToMany } from "typeorm";
import { PatientConditionEntity } from "./patientConditions.entity.ts";

@Entity({ name: "medicalConditions" })
export class MedicalConditionEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => PatientConditionEntity, (PatientConditionEntity) => PatientConditionEntity.medicalConditions)
    patientConditions: PatientConditionEntity [];
}