import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable
} from "typeorm"
import { User } from "./user";
import { Subscribe } from "./subscribe";

@Entity()
export class Node {

  @PrimaryGeneratedColumn()
  id: Number
  
  @Column("enum", { enum: ["SSR", "V2RAY", "SS"], default: "SS" })
  type: String

  @Column('jsonb')
  info: any

  @Column({ default: 0 })
  serial: Number

  @ManyToOne(node => User, user => user.nodes) 
  user: User

  @ManyToMany(node => Subscribe, subcribe => subcribe.nodes)
  subscribes: Subscribe[]
}