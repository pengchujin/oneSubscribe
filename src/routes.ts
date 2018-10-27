
// import * as Router from 'koa-router'
// import * as koaBody from 'koa-bodyparser'

// import { createConnection } from "typeorm"
// import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'

// import { schema } from './schema';
// export const routes = new Router();

// (async () => {
//     const db = await createConnection();

//     const apiEntrypointPath = '/graphql';
//     const graphqlApi = (ctx, next) => graphqlKoa({
//         schema,
//         context: {
//             ctx,
//             db,
//             jwt: ctx.header.authorization
//         }
//     })(ctx, next)
//     routes.get(apiEntrypointPath, koaBody(),graphqlApi)
//     routes.post(apiEntrypointPath, koaBody(), graphqlApi)
//     routes.get('/graphiql', graphiqlKoa({ endpointURL: apiEntrypointPath }));
// })()
