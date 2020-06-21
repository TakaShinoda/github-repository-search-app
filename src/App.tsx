import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { GITHUB_TOKEN } from './client'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const ME = gql`
  query me {
    user(login: "TakaShinoda") {
      name
      avatarUrl
    }
  }
`

export const App = () => {
  const headersLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    })
    return forward(operation)
  })

  const endpoint = 'https://api.github.com/graphql'
  const httpLink = new HttpLink({ uri: endpoint })
  const link = ApolloLink.from([headersLink, httpLink])

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  })

  return (
    <>
      <ApolloProvider client={client}>
        <div>Hello GraphQL</div>

        <Query query={ME}>
          {({ loading, error, data }) => {
            if (loading) return `Loading...`
            if (error) return `Error! ${error.message}`
            return <div>{data.user.name}</div>
          }}
        </Query>
      </ApolloProvider>
    </>
  )
}
