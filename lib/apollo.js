import { ApolloClient, InMemoryCache } from '@apollo/client'

const env =
	process.env.NODE_ENV === 'production'
		? 'https://www.musicmatters.life'
		: 'http://localhost:3000'
const client = new ApolloClient({
	uri: env + '/api/graphql',
	cache: new InMemoryCache({
		addTypename: false,
		resultCaching: false,
	}),
})

export default client
