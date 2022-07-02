import mongoose, { Schema } from "mongoose";

const UsersSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  avatar: {
    type: String,
  },
  chordbooks: {
    type: [String],
  },
  date: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.users || mongoose.model("users", UsersSchema);
