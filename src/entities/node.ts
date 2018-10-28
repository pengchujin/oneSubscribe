import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne
} from "typeorm"
import { User } from "./user";
import { Subscribe } from "./subscribe";

@Entity()
export class Node {

  @PrimaryGeneratedColumn()
  id: Number
  
  @Column()
  type: String

  @Column('jsonb')
  info: any

  @Column()
  serial: Number

  @ManyToOne(node => User, user => user.nodes) 
  user: User

  @ManyToOne(node => Subscribe, subscribe => subscribe.nodes) 
  subscribe: Subscribe

}