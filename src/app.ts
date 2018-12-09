import * as Koa from 'koa'
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
import * as Router from 'koa-router'
const mount = require('koa-mount');
import routers from './util/routers'
const userAgent = require('koa-useragent')
import * as graphqlHTTP from 'koa-graphql';
import { createConnection } from "typeorm"
import { schema } from './schema';
const koaPlayground = require('./util/index').default


const bootstrap = async () => {
    const app = new Koa()
    const db = await createConnection();
    app.use(bodyParser())
    app.use(cors())
    app.use(userAgent)
    const router = new Router()
    app.use(mount('/graphql', graphqlHTTP((ctx, next) => {
      return {
        schema,
        context: {
          db: db,
          graphiql: true,
          ctx: ctx,
          jwt: ctx.req.headers.authorization,
        }
      }
    })))
    router.all( '/playground',
    koaPlayground({
      endpoint: '/graphql',
    }))
    app.use(routers.routes())
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.listen(3001)
}

bootstrap()
