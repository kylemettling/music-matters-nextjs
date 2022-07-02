import mongoose from 'mongoose'

const MongoDb = process.env.MONGO_URL

const connectDb = async () => {
	try {
		await mongoose.connect(MongoDb, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// useFindAndModify: false,
			// useCreateIndex: true,
		})
		console.log('db success connect')
	} catch (err) {
		console.log('error connecting to database')
		console.log(err)
		process.exit(1)
	}
}

module.exports = connectDb

// const connectDb = (handler) => async (req, res) => {
// 	if (mongoose.connections[0].readyState !== 1) {
// 		await mongoose.connect(process.env.MONGO_URL, {
// 			useNewUrlParser: true,
// 			useUnifiedTopology: true,
// 		})
// 	}
// 	return handler(req, res)
// }

// const db = mongoose.connection

// db.once('open', () => {
// 	console.log('Connected to mongo')
// })

// export default connectDb
