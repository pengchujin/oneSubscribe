import * as Router from 'koa-router'
import  axios from 'axios'

const routers = new Router()

let url = 'http://127.0.0.1:3001/graphql'

routers.get('/allnodes/:uuid', async (ctx, next) => {
  let params = ctx.params.uuid
  let response = await axios.post(url, {
    query: `
    mutation{ getAllNodes(urlKey: "${params}")}
      `
  })
  ctx.body = response.data.data.getAllNodes + ''
})

export default routers