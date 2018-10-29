import { User } from "../entities/user"
import { Node } from "../entities/node"
import * as bcrypt from "bcrypt"
import * as Jwt from "jsonwebtoken"
import * as config from "../../config"
import { validationError } from "../util/errors"
import { ensureUser } from "../util/authentication"
import { from } from "apollo-link";
let Message = {
  TF: false,
  Message: "something wrong"
}
// import * as R from "ramda"
export async function signup(_obj, { username, password }, { db }) {
  console.log('sign Uping')
  const repository = db.getRepository(User);
  const hash = bcrypt.hashSync(password, config.SALT_ROUNDS);
  let b = {
    encryptedPassword: hash,
    username: username
  }
  await repository.save(b);
  const userSaved = await repository.findOne({ username: username })
  let TF = bcrypt.compareSync(password, userSaved.encryptedPassword)
  Message.TF = TF
  Message.Message = "OK"
  return Message
}

function authenticate(user, password) {
  if (!user) {
    return false
  } else {
    return bcrypt.compareSync(password, user.encryptedPassword)
  }
}

export async function signin(_obj, { username, password }, { db }) {
  let a = { jwt: String, id: Number, username: String }
  const repository = db.getRepository(User);
  const userSaved = await repository.findOne({ username: username })
  let TF = authenticate(userSaved, password)
  if (TF) {
    let userToken = {
      username: username,
      id: userSaved.id
    }
    const jwt = Jwt.sign(userToken, config.JWT_SECRET, { expiresIn: '1h' })
    a.jwt = jwt
    a.username = username
    a.id = userSaved.id
  } else {
    throw validationError({
      LoginError: ["用户名,或者密码错误"]
    });
  }
  return a
}

export async function addNode(_obj, { type, nodeInfo }, { db, jwt }) {
  let user = await ensureUser(db, jwt)
  console.log(user, nodeInfo)
  let testNode = {
    "obfsParam" : "",
    "weight" : 1540271438,
    "allowInsecure" : false,
    "title" : "香港GoogleCloud",
    "host" : "hk1.qust.me",
    "ota" : false,
    "file" : "",
    "uuid" : "40F5F639-3815-4DA4-A9D4-B508632183EC",
    "method" : "chacha20",
    "flag" : "US",
    "obfs" : "plain",
    "type" : "ShadowsocksR",
    "user" : "",
    "protoParam" : "",
    "tls" : false,
    "port" : 8888,
    "proto" : "origin",
    "password" : "oneisall",
    "data" : "",
    "ping" : 171
  }
  const nodeRepository = db.getRepository(Node);
  const node = nodeRepository.create({
    type: type,
    info: nodeInfo,
    // user: user
  })
  let Res = await nodeRepository.save(node)
  return {
    TF: true,
    Message: Res
  }
}

// export async function cPassword(_obj, { username, oPassword, nPassword }, { db }) {
//   let Result = false;
//   let Message = '修改失败'
//   const repository = db.getRepository(User);
//   const userModel = await repository.findOne({ username: username });
//   console.log(userModel)
//   console.log(oPassword, nPassword)
//   const TF = bcrypt.compareSync(oPassword, userModel.encryptedPassword)
//   console.log(userModel.encryptedPassword)
//   console.log('===================TF: ', TF)
//   if (TF) {
//     Message = '修改成功'
//     Result = true
//     const hash = bcrypt.hashSync(nPassword, config.SALT_ROUNDS);
//     await repository.update({ username: username }, { encryptedPassword: hash })
//   }
//   const Res = {
//     TF: Result,
//     Message: Message
//   }
//   return Res;
// }

// export async function dUser(_obj, { username }, { db }) {
//   let Result = false;
//   let Message = '修改失败'
//   const repository = db.getRepository(User);
//   const model = await repository.findOne({ username: username })

//   console.log(model)
//   if (model!) {
//     Result = true;
//     Message = '删除成功';
//     await repository.remove(model)
//   }
//   const Res = {
//     TF: Result,
//     Message: Message
//   }
//   return Res
// }