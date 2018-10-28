
import { resolvers } from "./resolvers";
import { makeExecutableSchema } from "graphql-tools";
import * as fs from "fs"
import * as path from "path"

const schemaPath = path.join(__filename, "..", "api", "api.graphql")
const typeDefs = fs.readFileSync(schemaPath, "utf8")
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

