import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index
} from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    length: "20"
  })
  @Index({ unique: true })
  username: string;

  @Column("text") encryptedPassword: string;
}
