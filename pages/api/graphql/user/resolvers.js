// import { GraphQLScalarType } from "graphql";
// import { Kind } from "graphql/language";
import User from "./user";

export const userResolvers = {
  Query: {
    async user(_, args, context) {
      const { id } = args;
      try {
        const user = await User.findById(id);
        return user;
      } catch (err) {
        console.log(err);
      }
    },
    async users(_, args, context) {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
