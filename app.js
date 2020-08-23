import express from 'express'
import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'

const app = express()
let events = []

let schema = buildSchema(`
    type Event {
        _id: String!
        title: String!
        description: String!
    }

    type Query {
        events: [Event!]!
    }

    input EventInput {
        title: String!
        description: String!
    }

    type Mutation {
        createEvent(input: EventInput): Event
    }

    schema {
        query: Query,
        mutation: Mutation
    }
`)

let root = {
    events: () => events,
    createEvent: ({ input }) => {
        const createdEvent = {
            _id: Math.random().toString(),
            title: input.title,
            description: input.description
        }
        events.push(createdEvent)

        return createdEvent
    }
}

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root
}))

app.listen(3000, () => console.log(`App running on port 3000`))