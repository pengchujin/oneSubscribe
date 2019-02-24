import * as Router from 'koa-router'
import  axios from 'axios'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as YAML from 'json2yaml'
const routers = new Router()

let url = 'http://127.0.0.1:3001/graphql'

routers.get('/allnodes/:uuid', async (ctx, next) => {
  let client = ctx.userAgent.platform
  let params = ctx.params.uuid
  let response = await axios.post(url, {
    query: `
    mutation{ getAllNodes(urlKey: "${params}", client: "${client}")}
      `
  })
  ctx.body = response.data.data.getAllNodes + ''
})

routers.get('/v2ray/:uuid', async (ctx, next) => {
  let client = ctx.userAgent.platform
  let params = ctx.params.uuid
  let response = await axios.post(url, {
    query: `
    mutation{ getAllNodes(urlKey: "${params}", client: "${client}", type: V2RAY)}
      `
  })
  ctx.body = response.data.data.getAllNodes + ''
})

routers.get('/ssr/:uuid', async (ctx, next) => {
  let client = ctx.userAgent.platform
  let params = ctx.params.uuid
  let response = await axios.post(url, {
    query: `
    mutation{ getAllNodes(urlKey: "${params}", client: "${client}", type: SSR)}
      `
  })
  ctx.body = response.data.data.getAllNodes + ''
})

routers.get('/ClashX/:uuid', async (ctx, next) => {
  let params = ctx.params.uuid
  let response = await axios.post(url, {
    query: `
    mutation{ getClashX(urlKey: "${params}") {
      id type info { add ps aid id net path tls type title port host method obfs obfsParam proto protoParam password }
    } }
      `
  })
  try {
    var doc = yaml.safeLoad(fs.readFileSync(__dirname +'./clash.yml', 'utf8'));
  } catch (e) {
    console.log(e);
  }
  let nodes = response.data.data.getClashX
  let group =[]
  for(let i of nodes) {
    if(i.type == "SSR") {
     let ss = { 
       name: i.info.title,
       type: 'ss',
       server: i.info.host,
       port: parseInt(i.info.port),
       cipher: i.info.method,
       password: i.info.password }
      doc.Proxy.push(ss)
      group.push(i.info.title)
    } else if(i.type == "V2RAY") {
      let vmess = { 
      name: i.info.ps, 
      type: "vmess", 
      server: i.info.add, 
      port: parseInt(i.info.port), 
      uuid: i.info.id, 
      alterId: parseInt(i.info.aid), 
      cipher: "auto" }
      if(i.info.tls == "tls") {
        if (i.info.net != "ws") {
          vmess["tls"] = true
        } else {
          vmess["network"] = "ws"
          vmess["tls"] = true
          vmess["ws-path"] = i.info.path
        }
      } else {
        if (i.info.net == "ws") {
          vmess["network"] = "ws"
          vmess["ws-path"] = i.info.path
          vmess["ws-headers"] = {
            Host: i.info.host
          }
        }
      }
      doc.Proxy.push(vmess)
      group.push(i.info.ps)
    }
  }
  let group2 = group.concat('auto')
  doc["Proxy Group"][0].proxies = group
  doc["Proxy Group"][1].proxies = group
  doc["Proxy Group"][2].proxies = group2
  let res = YAML.stringify(doc) 
  ctx.body = res
})

export default routers