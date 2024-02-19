import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"; 
import {Item} from "./item";

@Entity('user') 
export class User {   

  @PrimaryGeneratedColumn()
  id!: number; 
  
  @Column()
  firstName!: string; 
  
  @Column()
  lastName!: string;

  @Column({unique: true})
  email!: string; 

  @OneToMany(type => Item, item => item.user)
  items!: Item[];

}