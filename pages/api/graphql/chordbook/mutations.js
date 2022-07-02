import Chordbook from "./chordbook";

export const chordbookMutations = {
  Mutation: {
    async addChordbook(_, { chordbook }, context) {
      // chordbook.userId = userId
      console.log(
        "🚀 ~ file: mutations.js ~ line 6 ~ addChordbook ~ chordbook",
        chordbook
      );
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
      console.log("in updateChordbook", songId, userId, chordbooks);
      //   chordbook.userId = userId;
      //   chordbook.songId = songId;
      //   const data = chordbook.slice();
      console.log("updated prior to DB", chordbooks);
      try {
        const newChordbook = await Chordbook.findOneAndUpdate(
          { songId, userId },
          {
            data: chordbooks,
          },
          { upsert: true }
        );
        console.log("updatedChordbook", newChordbook);
        return newChordbook;
      } catch (e) {
        console.log(e);
      }
    },

    // async addEvent(_, { habitId, date }) {
    // 	try {
    // 		date.setHours(0, 0, 0, 0)
    // 		const habit = await Habits.findOneAndUpdate(
    // 			{
    // 				_id: habitId,
    // 				'events.date': {
    // 					$ne: date,
    // 				},
    // 			},
    // 			{
    // 				$addToSet: {
    // 					events: {
    // 						date,
    // 					},
    // 				},
    // 			}
    // 		)
    // 		return habit
    // 	} catch (e) {
    // 		console.log(e)
    // 	}
    // },

    // async removeChordbook(_, { chordbook, user }) {
    // 	try {
    // 		const habit = await Habits.findOneAndUpdate(
    // 			{
    // 				_id: habitId,
    // 			},
    // 			{
    // 				$pull: {
    // 					events: {
    // 						_id: eventId,
    // 					},
    // 				},
    // 			}
    // 		)
    // 		return habit
    // 	} catch (e) {}
    // },
  },
};
