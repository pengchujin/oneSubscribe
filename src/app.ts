import * as Koa from 'koa'
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
import * as Router from 'koa-router'
const mount = require('koa-mount');

const { graphqlKoa } = require('apollo-server-koa')
import * as graphqlHTTP from 'koa-graphql';
import { createConnection } from "typeorm"
import { ApolloServer} from 'apollo-server-koa'
import { GraphQLOptions } from 'apollo-server-koa';
import { schema } from './schema';
const { makeExecutableSchema } = require('graphql-tools')
const koaPlayground = require('./util/index').default


const bootstrap = async () => {
    const app = new Koa()
    const db = await createConnection();
    app.use(bodyParser())
    app.use(cors())
    const router = new Router()
    app.use(mount('/graphql', graphqlHTTP(req => {
      return {
        schema,
        context: {
          db: db,
          graphiql: true,
          jwt: req.headers.authorization,
        }
      }
    })))
    router.all( '/playground',
    koaPlayground({
      endpoint: '/graphql',
    }),)
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.listen(3001)
}

bootstrap()
