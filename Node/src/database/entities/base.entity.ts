import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Entity,
} from 'typeorm';

@Entity({ name: 'base' })
export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    readonly createdAt: Date;

    @UpdateDateColumn()
    readonly updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}