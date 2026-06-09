import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, ManyToMany, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity.ts";
import { CustomFoodNutrients } from '../../models/customFood.types.ts';

@Entity({ name: "customFood" })
export class CustomFoodEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.patients, { cascade: true })
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @Column()
    foodName: string;

    @Column()
    description: string;

    @Column({ type: "float" })
    serving_size: number;

    @Column()
    group: string;

    @Column()
    serving_size_unit: string;

    @Column()
    measuring_description: string;

    @Column()
    energy_unit: string;

    @Column()
    energy_qty_per_serving: string;

    @Column()
    energy_percent_RQI: string;

    @Column()
    energy_qty_per_100: string;

    @Column()
    protein_unit: string;

    @Column()
    protein_qty_per_serving: string;

    @Column()
    protein_percent_RQI: string;

    @Column()
    protein_qty_per_100: string;

    @Column()
    totalFat_unit: string;

    @Column()
    totalFat_qty_per_serving: string;

    @Column()
    totalFat_percent_RQI: string;

    @Column()
    totalFat_qty_per_100: string;

    @Column()
    saturatedFat_unit: string;

    @Column()
    saturatedFat_qty_per_serving: string;

    @Column()
    saturatedFat_percent_RQI: string;

    @Column()
    saturatedFat_qty_per_100: string;

    @Column()
    carbohydrate_unit: string;

    @Column()
    carbohydrate_qty_per_serving: string;

    @Column()
    carbohydrate_percent_RQI: string;

    @Column()
    carbohydrate_qty_per_100: string;

    @Column()
    sugars_unit: string;

    @Column()
    sugars_qty_per_serving: string;

    @Column()
    sugars_percent_RQI: string;

    @Column()
    sugars_qty_per_100: string;
    
    @Column()
    fiber_unit: string;

    @Column()
    fiber_qty_per_serving: string;

    @Column()
    fiber_percent_RQI: string;

    @Column()
    fiber_qty_per_100: string;
    
    @Column()
    sodium_unit: string;

    @Column()
    sodium_qty_per_serving: string;

    @Column()
    sodium_percent_RQI: string;

    @Column()
    sodium_qty_per_100: string;
}
