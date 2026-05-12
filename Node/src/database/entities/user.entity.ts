import { BaseEntity } from "./base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    username: string;

    @Column()
    password: string;
}