import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { PatientEntity } from "./patient.entity.ts";

@Entity({ name: "medicalConditions" })
export class MedicalConditionEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => PatientEntity, (PatientEntity) => PatientEntity.patientConditions)
    @JoinColumn()
    patientConditions: PatientEntity [];
}