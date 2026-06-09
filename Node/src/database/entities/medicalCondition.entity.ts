import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { PatientEntity } from "./patient.entity.ts";
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