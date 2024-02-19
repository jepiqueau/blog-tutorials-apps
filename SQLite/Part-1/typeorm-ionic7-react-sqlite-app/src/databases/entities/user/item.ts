import {Entity, Column, PrimaryGeneratedColumn, ManyToOne,
    type Relation} from 'typeorm';
import {User} from "./user";

@Entity('item')
export class Item {
@PrimaryGeneratedColumn()
id!: number;

@Column()
name!: string;

@Column({unique: true})
phoneNumber!: number;

@ManyToOne(type => User, user => user.items, {
    cascade: ['insert']
})
user!: Relation<User>;

}