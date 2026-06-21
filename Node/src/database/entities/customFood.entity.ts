import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, ManyToMany, OneToMany, Relation } from "typeorm";
import { UserEntity } from "./user.entity.ts";
import { CustomFoodNutrients } from '../../models/customFood.types.ts';
import { FoodLogEntity } from "./foodLog.entity.ts";
import { CustomFoodMicroNutrientsEntity } from "./customFoodMicroNutrients.entity.ts";

@Entity({ name: "customFood" })
export class CustomFoodEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.customFoods, { cascade: true })
    @JoinColumn({ name: "userId" })
    user: Relation<UserEntity>;

    @Column()
    userId: string;

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
    measure_description: string;

    @Column()
    energy_unit: string;

    @Column()
    energy_qty_per_serving: string;

    @Column()
    energy_percent_RDI: string;

    @Column()
    energy_qty_per_100: string;

    @Column()
    protein_unit: string;

    @Column()
    protein_qty_per_serving: string;

    @Column()
    protein_percent_RDI: string;

    @Column()
    protein_qty_per_100: string;

    @Column()
    totalFat_unit: string;

    @Column()
    totalFat_qty_per_serving: string;

    @Column()
    totalFat_percent_RDI: string;

    @Column()
    totalFat_qty_per_100: string;

    @Column()
    saturatedFat_unit: string;

    @Column()
    saturatedFat_qty_per_serving: string;

    @Column()
    saturatedFat_percent_RDI: string;

    @Column()
    saturatedFat_qty_per_100: string;

    @Column()
    carbohydrates_unit: string;

    @Column()
    carbohydrates_qty_per_serving: string;

    @Column()
    carbohydrates_percent_RDI: string;

    @Column()
    carbohydrates_qty_per_100: string;

    @Column()
    sugars_unit: string;

    @Column()
    sugars_qty_per_serving: string;

    @Column()
    sugars_percent_RDI: string;

    @Column()
    sugars_qty_per_100: string;
    
    @Column()
    fiber_unit: string;

    @Column()
    fiber_qty_per_serving: string;

    @Column()
    fiber_percent_RDI: string;

    @Column()
    fiber_qty_per_100: string;
    
    @Column()
    sodium_unit: string;

    @Column()
    sodium_qty_per_serving: string;

    @Column()
    sodium_percent_RDI: string;

    @Column()
    sodium_qty_per_100: string;

    @OneToMany(() => FoodLogEntity, (FoodLogEntity) => FoodLogEntity.customFood)
    foodLogs: FoodLogEntity[];

    @OneToMany(() => CustomFoodMicroNutrientsEntity, (CustomFoodMicroNutrientsEntity) => CustomFoodMicroNutrientsEntity.customFood ,{cascade: true})
    customFoodMicroNutrients: CustomFoodMicroNutrientsEntity[];
}
