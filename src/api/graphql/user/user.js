import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
	userObjectId: {
		type: String,
		required: true,
		// unique: true,
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
	chordbooks: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Chordbook',
		},
	],
	date: {
		type: Date,
		// required: true,
	},
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
