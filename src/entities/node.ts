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
  
  @Column("enum", { enum: ["SSR", "V2RAY", "SS"], default: "SS" })
  type: String

  @Column('')
  info: string

  @Column({ default: 0 })
  serial: Number

  @ManyToOne(node => User, user => user.nodes) 
  user: User

  @ManyToOne(node => Subscribe, subscribe => subscribe.nodes) 
  subscribe: Subscribe

}