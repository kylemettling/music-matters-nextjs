import mongoose, { Schema } from "mongoose";

const ChordbookSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  songId: {
    type: String,
    required: true,
  },
  data: [{}],
  createdAt: {
    type: Date,
  },
});

export default mongoose.models.Chordbook ||
  mongoose.model("Chordbook", ChordbookSchema);
