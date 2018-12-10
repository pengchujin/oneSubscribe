export function v2rayIOS(nodes) {
  let servers = ''
  for(let node of nodes) {
    if(node.type == 'V2RAY') {
      !node.info.method ? node.info.method = 'chacha20-poly1305' : ''
      let v2rayBase = '' + node.info.method + ':' + node.info.id + '@' +  node.info.add + ':' + node.info.port
      let remarks = ''
      // let obfsParam = ''
      let path = ''
      let obfs = ''
      let tls = ''
      !node.info.ps ? remarks = 'remarks=oneSubscribe' : remarks = `remarks=${node.info.ps}`
      !node.info.path ? '' : path = `&path=${node.info.path}`
      node.info.net == 'ws' ? obfs = `&obfs=websocket` : ''
      node.info.net == 'h2' ? obfs = `&obfs=http` : ''
      node.info.tls == 'tls' ? tls = `&tls=1` : ''
      let query = remarks + path + obfs + tls
      let baseV2ray =  Buffer.from(v2rayBase).toString('base64')
      let server = Buffer.from('vmess://' + baseV2ray + '?' + query)
      servers = servers + server + '\n'
    }
  }
  return servers
}