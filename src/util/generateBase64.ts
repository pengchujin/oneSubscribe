import { v2rayAndroid } from './ v2rayAndroid'
import { v2rayIOS } from './v2rayIOS'
import {  ssr } from './ssr'
export function generateBase64(nodes, client){
  let a = []
  let v2rayServers = ''
  let ssrServers = ''
  // android
  if(client == 'Android') {
    v2rayServers = v2rayAndroid(nodes)
  } 
  // iOS
  else {
    v2rayServers = v2rayIOS(nodes)
  }
  ssrServers = ssr(nodes)
  return Buffer.from(v2rayServers + ssrServers).toString('base64')
}