import { User } from "../entities/user"
import * as R from "ramda"
import { ensureUser } from "../util/authentication"

export async function users(root, params, ctx) {
  // test

  // 
  console.log(typeof (ctx), "==================")
  const repository = ctx.db.getRepository(User)
  const users = await repository.find()
  console.log(users, "?????????")
  return users
  // return R.compose(R.pick(["id","username"]))(users)
}
export async function jwt(_obj, { }, { db, jwt }) {
  const user = await ensureUser(db, jwt)
  console.log(user)
  return R.compose(R.merge({ jwt: jwt }), R.pick(["id", "username"]))(user)
}
