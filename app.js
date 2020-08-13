import express from 'express'
import bodyParser from 'body-parser'
import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'

const app = express()

app.use(bodyParser.json())

const events = []
app.use(
    '/gql',
    graphqlHTTP({
        graphiql: true,
        schema: buildSchema(`
            type Event {
                _id: String!
                title: String!
                description: String!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            input EventInput {
                _id: String!
                title: String!
                description: String!
                date: String!
            }

            type RootMutation {
                createEvent(input: EventInput): Event
            }

            schema {
                query: RootQuery,
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => events,
            createEvent: ({ input }) => {
                const event = {
                    _id: Math.random(),
                    title: input.title,
                    description: input.description,
                    date: input.date
                }
                events.push(event)
                
                return event
            }
        }
    })
)

app.listen(3000, () => console.log(`App running on port 3000`))