import { BaseJunctionEntity } from "./baseJunction.entity.ts";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { PatientEntity } from "./patient.entity.ts";
import { DietaryRestrictionEntity } from "./dietaryRestriction.entity.ts";

@Entity({ name: "patient Restriction" })
export class PatientRestrictionEntity extends BaseJunctionEntity {

    @PrimaryColumn({name: "patientId"})
    patientId: string;

    @ManyToOne(() => PatientEntity, (PatientEntity) => PatientEntity.patientRestrictions, { cascade: true})
    @JoinColumn({ name: "patientId"})
    patients: Relation<PatientEntity>;
    
    @PrimaryColumn({name: "dietaryRestrictionId"})
    dietaryRestrictionId: string;

    @ManyToOne(() => DietaryRestrictionEntity, (DietaryRestrictionEntity) => DietaryRestrictionEntity.patientRestrictions, { cascade: true})
    @JoinColumn({ name: "dietaryRestrictionId"})
    dietaryRestrictions: Relation<DietaryRestrictionEntity>;
}