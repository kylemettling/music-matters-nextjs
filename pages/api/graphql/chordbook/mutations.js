import Chordbook from "./chordbook";

export const chordbookMutations = {
  Mutation: {
    async addChordbook(_, { chordbook }, context) {
      try {
        const newChordbook = await Chordbook.create({
          ...chordbook,
        });
        return newChordbook;
      } catch (e) {
        console.log(e);
      }
    },
    async updateChordbook(_, { songId, userId, chordbooks }, context) {
      try {
        const newChordbook = await Chordbook.findOneAndUpdate(
          { songId, userId },
          {
            data: chordbooks,
          },
          { upsert: true }
        );
        return newChordbook;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
