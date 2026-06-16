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
    patientId: string

    @Column({type: "varchar", nullable: true })
    FCDBFoodId: string | null

    @ManyToOne(() => CustomFoodEntity, (CustomFoodEntity) => CustomFoodEntity.foodLogs, { cascade: true })
    @JoinColumn({ name: "CustomFoodId" })
    customFood: Relation<CustomFoodEntity>;

    @Column({nullable: true })
    CustomFoodId: string | null

    @Column()
    dateTime: string

    @Column({ type: "float" })
    amount: number

    @Column()
    unit: string

    @Column()
    mealType: string
}
