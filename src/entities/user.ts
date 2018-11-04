import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany
} from "typeorm";
import { Node } from "./node";
import { Subscribe } from "./subscribe";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: "20"
  })
  @Index({ unique: true })
  username: string;

  @Column("text") encryptedPassword: string;

  @OneToMany(type => Node, node => node.user) 
  nodes: Node[]

  @OneToMany(type => Subscribe, subscribe => subscribe.user) 
  subscribes: Subscribe[]
}
