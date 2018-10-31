import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable
} from "typeorm";
import { Node } from "./node";
import { User } from "./user";

@Entity()
export class Subscribe{

  @PrimaryGeneratedColumn() 
  id: number

  @Column()
  name: String

  @ManyToMany(type => Node,  node => node.subscribes, {eager: true})
  @JoinTable()
  nodes: Node[]

  @ManyToOne(subscribe => User, user => user.subscribes)
  user: User

}
