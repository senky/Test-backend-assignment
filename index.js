import express from 'express'
import {graphqlHTTP} from 'express-graphql'
import {makeExecutableSchema} from 'graphql-tools'

const app = express()

const RootQuery = `
  type RootQuery {
    hello: String!
  }
`

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`

const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery],
  resolvers: {
    RootQuery: {
      hello: () => 'world',
    }
  }
})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

const host = process.env.host || 'localhost'
const port = process.env.port || 8000

app.listen(port, host, () => {
  console.debug(`Server is running at http://${host}:${port}`)
})

export default app
