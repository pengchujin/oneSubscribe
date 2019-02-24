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
  const userSaved = await repository.findOne({ username: username })
  let TF = authenticate(userSaved, password)
  if (TF) {
    let userToken = {
      username: username,
      id: userSaved.id
    }
    const jwt = Jwt.sign(userToken, config.JWT_SECRET, { expiresIn: '30d' })
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
  const nodeRepository = db.getRepository(Node);
  const node = nodeRepository.create({
    type: type,
    info: nodeInfo,
    user: user
  })
  await nodeRepository.save(node)
  return {
    TF: 'success',
    Message: `节点 ${nodeInfo.title} 已添加成功 `
  }
}

export async function addV2rayNode(_obj, { type, nodeInfo }, { db, jwt }) {
  const user = await ensureUser(db, jwt)
  const nodeRepository = db.getRepository(Node);
  const node = nodeRepository.create({
    type: type,
    info: nodeInfo,
    user: user
  })
  await nodeRepository.save(node)
  return {
    TF: 'success',
    Message: `节点 ${nodeInfo.ps} 已添加成功 `
  }
}

export async function createSubscribe(_obj, { nodes, name }, { db, jwt }) {
  const user = await ensureUser(db, jwt)
  const nodeRepository = db.getRepository(Node);
  const subscribeRepository = db.getRepository(Subscribe)
  if(!nodes) {
    let subscribeNodes =  await nodeRepository.find({user: user})
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
  return {
    TF: 'success',
    Message: `节点 ${nodeInfo.title} 已修改 `
  }
} 

export async function modifyV2rayNode(_obj, { nodeID, nodeInfo }, { db, jwt}) {
  const user = await ensureUser(db, jwt)
  const nodeRepository = db.getRepository(Node);
  let node = await nodeRepository.findOne({user: user, id: nodeID })
  await nodeRepository.update(node, {info: nodeInfo})
  return {
    TF: 'success',
    Message: `节点 ${nodeInfo.ps} 已修改 `
  }
}

export async function modifySubscribe(_obj, { id, name, nodes }, { db, jwt }){
  const user = await ensureUser(db, jwt)
  const subscribeRepository = db.getRepository(Subscribe)
  const nodeRepository = db.getRepository(Node);
  let subscribe = await subscribeRepository.findOne({user: user, id: id})
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
export async function deleteNode(_obj, { nodeID }, { db, jwt }) {
  const user = await ensureUser(db, jwt)
  const nodeRepository = db.getRepository(Node);
  let node = await nodeRepository.findOne({user: user, id: nodeID })
  await nodeRepository.delete(node)
  let info = ''
  if(!node.info.title){
    info = node.info.ps
  } else {
    info = node.info.title
  }
  return {
    TF: 'success',
    Message: `节点 ${info} 已删除 `
  }
}


export async function getSubscribe(_obj, { urlKey,  client}, { db, jwt }) {
  const subscribeRepository = db.getRepository(Subscribe)
  let subscribe = await subscribeRepository.findOne({id: urlKey})
  let nodes = subscribe.nodes
  return generateBase64(nodes, client)
}

export async function getAllNodes(_obj, { urlKey, client, type },ctx){
  const nodeRepository = ctx.db.getRepository(Node);
  const userRepository = ctx.db.getRepository(User)
  let user = await userRepository.findOne({id: urlKey})
  let nodes = []
  if(!type) {
    nodes = await nodeRepository.find({user: user})
  } else {
    nodes = await nodeRepository.find({user: user, type: type})
  }
  return generateBase64(nodes, client)
}

export async function getClashX(_obj, { urlKey },ctx) {
  const repository = ctx.db.getRepository(Node)
  const userRepository = ctx.db.getRepository(User)
  let user = await userRepository.findOne({id: urlKey})
  let nodes = await repository.find({where: {user: user}, order: {
    id: "DESC"
  }})
  return nodes
}
