import { ApolloServer } from 'apollo-server-micro'
import { makeExecutableSchema } from 'graphql-tools'
import Cors from 'micro-cors'
import connectDb from '../../lib/mongoose'
// import connectDb from '../../lib/mongoose'
import { chordbookTypeDefs } from './graphql/chordbook/typedefs.js'
import { userTypeDefs } from './graphql/user/typedefs.js'
import { chordbookMutations } from './graphql/chordbook/mutations'
import { chordbookResolvers } from './graphql/chordbook/resolvers'
import { userMutations } from './graphql/user/mutations'
import { userResolvers } from './graphql/user/resolvers'

connectDb()

export const schema = makeExecutableSchema({
	typeDefs: [chordbookTypeDefs, userTypeDefs],
	resolvers: [
		chordbookMutations,
		chordbookResolvers,
		userMutations,
		userResolvers,
	],
})

const cors = Cors()

export const config = {
	api: {
		bodyParser: false,
	},
}
const server = new ApolloServer({
	schema,
})
const startServer = server.start()

export default cors(async (req, res) => {
	if (req.method === 'OPTIONS') {
		res.end()
		return false
	}
	if (process.env === 'production') {
		console.log('production!')
		const path = '/src/api/graphql'
		await startServer
		await server.createHandler({ path })(req, res)
	} else {
		await startServer
		await server.createHandler({ path: 'api/graphql' })(req, res)
	}
})
// connectDb()

// export const schema = makeExecutableSchema({
// 	typeDefs: [chordbookTypeDefs, usersTypeDefs],
// 	resolvers: [chordbooksResolvers, chordbooksMutations],
// })

// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
// }

// export default new ApolloServer({ schema }).createHandler({
// 	path: 'api/graphql',
// })

// const fakeTypeDefs = gql`
//   type Query {
//     sayHello: String
//   }
// `;

// const fakeResolvers = {
//   Query: {
//     sayHello: () => {
//       return 'Hello Level Up!';
//     }
//   }
// };

// const typeDefs = mergeTypeDefs([Habits])
// const executableSchema = makeExecutableSchema({
// 	typeDefs: [chordbookTypeDefs, usersTypeDefs],
// 	chordbooksResolvers,
// 	chordbooksMutations,
// })

// const apolloServer = new ApolloServer({
// 	schema: executableSchema,
// })

// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
// }

// const server = apolloServer
// 	.listen({ path: '/api/graphql', port: process.env.PORT || 3001 })
// 	.then(({ url }) => {
// 		console.log('server at', url)
// 	})
// export default connectDb(server)
