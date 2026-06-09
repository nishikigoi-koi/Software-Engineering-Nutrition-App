import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, OneToMany } from "typeorm";
import { PatientEntity } from "./patient.entity.ts";
import { CustomFoodEntity } from "./customFood.entity.ts";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    username: string;

    @Column()
    passwordHash: string;

    @OneToMany(() => PatientEntity, (PatientEntity) => PatientEntity.user)
    patients: PatientEntity[];

    @OneToMany(() => CustomFoodEntity, (CustomFoodEntity) => CustomFoodEntity.user)
    customFoods: CustomFoodEntity[];
}