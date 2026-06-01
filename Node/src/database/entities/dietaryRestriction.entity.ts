import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { PatientEntity } from "./patient.entity.ts";

@Entity({ name: "dietaryRestrictions" })
export class DietaryRestrictionEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => PatientEntity, (PatientEntity) => PatientEntity.dietaryRestrictions)
    patients: PatientEntity[];
}
