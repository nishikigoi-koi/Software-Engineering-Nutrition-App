import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, ManyToMany, OneToMany, Relation } from "typeorm";
import { PatientEntity } from "./patient.entity.ts";
import { CustomFoodEntity } from "./customFood.entity.ts";

@Entity({ name: "foodLog" })
export class FoodLogEntity extends BaseEntity {
    @ManyToOne(() => PatientEntity, (PatientEntity) => PatientEntity.foodLogs, { cascade: true })
    @JoinColumn({ name: "patientId" })
    patient: Relation<PatientEntity>;

    @Column()
    FCDBFoodId: string

    @ManyToOne(() => CustomFoodEntity, (CustomFoodEntity) => CustomFoodEntity.foodLogs, { cascade: true })
    @JoinColumn({ name: "CustomFoodId" })
    customFood: Relation<CustomFoodEntity>;

    @Column()
    dateTime: string

    @Column()
    amount: string

    @Column()
    unit: string

    @Column()
    mealType: string
}
