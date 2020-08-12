import express from 'express'
import bodyParser from 'body-parser'
import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'

const app = express()

app.use(bodyParser.json())
app.use(
    '/gql',
    graphqlHTTP({
        graphiql: true,
        schema: buildSchema(`
            type RootQuery {
                events: [String!]!
            }

            type RootMutation {
                createEvent(name: String!): String
            }

            schema {
                query: RootQuery,
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => ['Romantic Cooking', 'All-night Coding'],
            createEvent: ({ name }) => name
        }
    })
)

app.listen(3000, () => console.log(`App running on port 3000`))