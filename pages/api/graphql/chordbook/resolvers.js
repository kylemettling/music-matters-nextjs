import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

import Chordbook from './chordbook'

export const chordbookResolvers = {
	Query: {
		async chordbook(obj, { songId, userId }, context) {
			console.log('In chordbook!', songId, userId)
			try {
				const chordbook = await Chordbook.findOne({ songId, userId })
				console.log('CHORDBOOK RESOLVER', chordbook)
				return chordbook
			} catch (e) {
				console.log('e', e)
			}
		},
		async userChordbooks(_, { userId }) {
			console.log('fetching in userChordbooks resolver', userId)
			try {
				const chordbooks = await Chordbook.find({ userId })
				return chordbooks
			} catch (err) {
				console.log(err)
			}
		},
	},
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar',
		parseValue(value) {
			return new Date(value) // value from the client
		},
		serialize(value) {
			return value.getTime() //value sent to the client
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return new Date(ast.value)
			}
			return null
		},
	}),
}

// export default chordbookResolvers;
