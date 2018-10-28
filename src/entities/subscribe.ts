import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  ManyToOne
} from "typeorm";
import { Node } from "./node";
import { User } from "./user";

@Entity()
export class Subscribe{

  @PrimaryGeneratedColumn() 
  id: number

  @Column()
  name: String

  @OneToMany(type => Node, node => node.subscribe) 
  nodes: Node[]

  @ManyToOne(subscribe => User, user => user.subscribes)
  user: User

}
