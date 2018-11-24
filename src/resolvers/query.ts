import { User } from "../entities/user"
import { Node } from "../entities/node"
import { Subscribe } from "../entities/subscribe"
import * as R from "ramda"
import { ensureUser } from "../util/authentication"

export async function nodesList(_obj, { }, { db, jwt}) {
  const user = await ensureUser(db, jwt)
  const repository = db.getRepository(Node)
  let nodes = await repository.find({where: {user: user}, order: {
    id: "DESC"
  }})
  console.log(nodes)
  return nodes
}

export async function subscribeList(_obj, { }, { db, jwt}) {
  const user = await ensureUser(db, jwt)
  const repository = db.getRepository(Subscribe)
  let subscribeList = await repository.find({user: user})
  console.log(subscribeList)
  // Todo
  return subscribeList
}