import { BaseEntity } from "./base.entity.ts";
import { Column, Entity, ManyToOne, JoinColumn, ManyToMany, OneToMany, Relation } from "typeorm";
import { UserEntity } from "./user.entity.ts";
import { CustomFoodEntity } from "./customFood.entity.ts";

@Entity({ name: "customFoodMicroNutrients" })
export class CustomFoodMicroNutrientsEntity extends BaseEntity {
    
    @ManyToOne(() => CustomFoodEntity, (CustomFoodEntity) => CustomFoodEntity.customFoodMicroNutrients)
    @JoinColumn({ name: "customFoodId" })
    customFood: Relation<CustomFoodEntity>;

    @Column()
    customFoodId: string

    @Column()
    name: string

    @Column()
    unit: string

    @Column()
    qty_per_serving: string

    @Column()
    percent_RDI: string

    @Column()
    qty_per_100: string
}