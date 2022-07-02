import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import User from "./user";
import Chordbook from "../chordbook/chordbook";

export const userResolvers = {
  Query: {
    async user(_, args, context) {
      const { id } = args;
      console.log("USER CHORDBOOK", args, id);
      try {
        const user = await User.findById(id);
        return user;
      } catch (err) {
        console.log(err);
      }
      // return {}
    },
    async users(_, args, context) {
      // const
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        console.log(err);
      }
    },
    // async userChordbook(_, args, context) {
    // 	const { songId, userId } = args
    // 	console.log('USER CHORDBOOK', songId, userId)
    // 	try {
    // 		// let chordbook = await Chordbook.findOne({
    // 		// 	songId,
    // 		// 	userId,
    // 		// })
    // 		// chordbook = chordbook.filter((book) => book.songId === songId)
    // 		// console.log('chordbook', chordbook)
    // 		// return chordbook
    // 	} catch (err) {
    // 		console.log(err)
    // 	}
    // 	// return {}
    // },
    // async userChordbooks(_, { userId }, context) {
    // 	try {
    // 		const chordbooks = await Chordbook.find({
    // 			userId,
    // 		})
    // 		console.log('all chordbooks', chordbooks)
    // 		return chordbooks
    // 	} catch (err) {
    // 		console.log(err)
    // 	}
    // 	// return {}
    // },
  },

  //   Date: new GraphQLScalarType({
  //     name: "Date",
  //     description: "Date custom scalar",
  //     parseValue(value) {
  //       return new Date(value); // value from the client
  //     },
  //     serialize(value) {
  //       return value.getTime(); //value sent to the client
  //     },
  //     parseLiteral(ast) {
  //       if (ast.kind === Kind.INT) {
  //         return new Date(ast.value);
  //       }
  //       return null;
  //     },
  //   }),
};

// export default userResolvers
