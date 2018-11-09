import { User } from "../entities/user"
import { Node } from "../entities/node"
import { Subscribe } from "../entities/subscribe"
import * as bcrypt from "bcrypt"
import * as Jwt from "jsonwebtoken"
import * as config from "../../config"
import { generateBase64 } from "../util/generateBase64"
import { validationError } from "../util/errors"
import { ensureUser } from "../util/authentication"
import { from } from "apollo-link";
let Message = {
  TF: '',
  Message: "OK"
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
  try {
    await repository.save(b)
  } catch(err) {
    return {
      TF: 'error',
      Message: '注册失败，邮箱已被注册'
     }
  }
  return {
    TF: 'success',
    Message: '注册成功请登录'
  }
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
  // 
  const subscribeRepository = db.getRepository(Subscribe)
  let subscribe = await subscribeRepository.findOne({name: "He3"})
  const nodes = await db
    .getRepository(Node)
    .createQueryBuilder("node")
    .where("node.id = :id", {id: 3})
    .leftJoinAndSelect("node.subscribes", "subcribe")
    .getMany();
  console.log(nodes)
  // const nodeRepository = db.getRepository(Node);
  // // const subscribeRepository = db.getRepository(Subscribe)
  // // let subscribe = await subscribeRepository.findOne({name: "He3"})
  // console.log(subscribe)
  // let nodeTest = await nodeRepository.find({subscribes: subscribe})
  // console.log(nodeTest)
  // 
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
  const user = await ensureUser(db, jwt)
  console.log(user, nodeInfo)
  const nodeRepository = db.getRepository(Node);
  const node = nodeRepository.create({
    type: type,
    info: nodeInfo,
    user: user
  })
  await nodeRepository.save(node)
  return {
    TF: 'success',
    Message: "添加节点成功"
  }
}

export async function createSubscribe(_obj, { nodes, name }, { db, jwt }) {
  const user = await ensureUser(db, jwt)
  console.log(nodes)
  const nodeRepository = db.getRepository(Node);
  const subscribeRepository = db.getRepository(Subscribe)
  if(!nodes) {
    let subscribeNodes =  await nodeRepository.find({user: user})
    console.log(subscribeNodes)
    subscribeRepository.save({
      name: name,
      nodes: subscribeNodes,
      user: user
    })
  } else {
    let subscribeNodes = []
    for (let node of nodes) {
      let subscribeNode =  await nodeRepository.findOne({user: user, id: node})    
      subscribeNodes.push(subscribeNode)
    }
    // const subscribe = new Subscribe()
    // subscribe.name = name
    // subscribe.nodes = subscribeNodes
    // subscribe.user = user
    // // console.log(subscribe)
    // await subscribeRepository.save(subscribe)
    // let nodeTest = await nodeRepository.find({subscribe: subscribe})
    // console.log(nodeTest)
    subscribeRepository.save({
      name: name,
      nodes: subscribeNodes,
      user: user
    })
  }
  return {
    TF: 'success',
    Message: "订阅创建成功"
  }
}

export async function modifyNode(_obj, { nodeID, nodeInfo }, { db, jwt}) {
  const user = await ensureUser(db, jwt)
  const nodeRepository = db.getRepository(Node);
  let node = await nodeRepository.findOne({user: user, id: nodeID })
  await nodeRepository.update(node, {info: nodeInfo})
  return Message
} 

export async function modifySubscribe(_obj, { id, name, nodes }, { db, jwt }){
  const user = await ensureUser(db, jwt)
  const subscribeRepository = db.getRepository(Subscribe)
  const nodeRepository = db.getRepository(Node);
  let subscribe = await subscribeRepository.findOne({user: user, id: id})
  console.log(subscribe)
  let subscribeNodes = []
  for (let node of nodes) {
    let subscribeNode =  await nodeRepository.findOne({user: user, id: node})    
    subscribeNodes.push(subscribeNode)
  }
  subscribe.nodes = subscribeNodes
  subscribe.name = name
  await subscribeRepository.save(subscribe)
  return Message
}

export async function getSubscribe(_obj, { urlKey }, { db, jwt }) {
  const subscribeRepository = db.getRepository(Subscribe)
  let subscribe = await subscribeRepository.findOne({id: urlKey})
  let nodes = subscribe.nodes
  return generateBase64(nodes)
}

export async function getAllNodes(_obj, { urlKey }, { db, jwt }){
  const nodeRepository = db.getRepository(Node);
  const userRepository = db.getRepository(User)
  let user = await userRepository.findOne({id: urlKey})
  let nodes = await nodeRepository.find({user: user})
  return generateBase64(nodes)
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