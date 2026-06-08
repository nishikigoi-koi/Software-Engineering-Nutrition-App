import { BaseJunctionEntity } from "./baseJunction.entity.ts";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { PatientEntity } from "./patient.entity.ts";
import { MedicalConditionEntity } from "./medicalCondition.entity.ts";

@Entity({ name: "patient Conditions" })
export class PatientConditionEntity extends BaseJunctionEntity {

    @PrimaryColumn({name: "patientId"})
    patientId: string;

    @ManyToOne(() => PatientEntity, (PatientEntity) => PatientEntity.patientConditions, { cascade: true})
    @JoinColumn({ name: "patientId"})
    patients: Relation<PatientEntity>;
    
    @PrimaryColumn({name: "medicalConditionId"})
    medicalConditionId: string;

    @ManyToOne(() => MedicalConditionEntity, (MedicalConditionEntity) => MedicalConditionEntity.patientConditions, { cascade: true})
    @JoinColumn({ name: "medicalConditionId"})
    medicalConditions: Relation<MedicalConditionEntity>;
}