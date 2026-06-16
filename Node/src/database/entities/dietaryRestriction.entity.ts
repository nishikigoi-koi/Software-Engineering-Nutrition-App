import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, OneToMany } from "typeorm";
import { PatientRestrictionEntity } from "./patientRestriction.entity.ts";

@Entity({ name: "dietaryRestrictions" })
export class DietaryRestrictionEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => PatientRestrictionEntity, (PatientRestrictionEntity) => PatientRestrictionEntity.dietaryRestrictions)
    patientRestrictions: PatientRestrictionEntity[];
}
