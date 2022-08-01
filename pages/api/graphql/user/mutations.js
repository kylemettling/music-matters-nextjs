import User from "./user";

export const userMutations = {
  Mutation: {
    async addUser(_, { input }, context) {
      try {
        const newUser = await User.findOneAndUpdate(
          {
            ...input,
          },
          { ...input },
          { upsert: true }
        );
        return newUser;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
