import User from './user'

export const userMutations = {
	Mutation: {
		async addUser(_, { input }, context) {
			// console.log('USER', args, context)
			console.log('INPUT', input)
			try {
				const newUser = await User.findOneAndUpdate(
					{
						...input,
					},
					{ ...input },
					{ upsert: true }
				)
				return newUser
			} catch (e) {
				console.log(e)
			}
		},
		// async addUserChordbook(_, { id, chordbookId }, context) {
		// 	console.log('addUserChordbook', id, chordbookId, context)

		// 	return { id: '123' }
		// },
	},
}
