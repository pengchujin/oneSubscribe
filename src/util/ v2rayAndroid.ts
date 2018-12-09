export function v2rayAndroid(nodes) {
  let v2rayServers = ''
  for(let node of nodes) {
    if(node.type == 'V2RAY') {
      let baseV2ray =  Buffer.from(JSON.stringify(node.info)).toString('base64')
      let server = Buffer.from('vmess://' + baseV2ray)
      v2rayServers = v2rayServers + server + '\n'
    }
  }
  return v2rayServers
}