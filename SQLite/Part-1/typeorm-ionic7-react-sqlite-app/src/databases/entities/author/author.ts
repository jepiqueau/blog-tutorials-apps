import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn} from 'typeorm';
import {Post} from './post';

@Entity('author')
export class Author {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
  
  @Column({nullable: true})
  company!: string;

  @Column({nullable: true})
  birthday!: string;

  @Column({unique: true})
  email!: string;

  @OneToMany(type => Post, post => post.author)
  posts!: Post[];
  
}
