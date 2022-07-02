import { gql } from 'apollo-server-micro'

export const chordbookTypeDefs = gql`
	scalar Date

	type Chordbook {
		id: ID!
		userId: String
		songId: String
		data: [ChordbookItem]
		createdAt: Date
	}
	input ChordbookInput {
		id: ID
		userId: String
		songId: String
		data: [ChordbookItemInput]
		createdAt: Date
	}
	#   input ChordbookUpdateInput {
	#     userId: String
	#     songId: String
	#     chordbook: [ChordbookItemInput]
	#   }
	type ChordbookItem {
		id: Int
		name: String
		root: String
		mode: String
		type: String
		isErasable: Boolean
		bookId: Int
		chords: [Chord]
	}
	input ChordbookItemInput {
		id: Int
		name: String
		root: String
		mode: String
		type: String
		isErasable: Boolean
		bookId: Int
		chords: [ChordInput]
	}

	type Chord {
		id: Int
		root: String
		type: String
		position: Int
		degree: String
	}

	input ChordInput {
		id: Int
		root: String
		type: String
		position: Int
		degree: String
	}

	type Query {
		# chordbooks: [Chordbook]
		userChordbooks(userId: String!): [Chordbook]
		chordbook(songId: String!, userId: String!): Chordbook
	}

	type Mutation {
		updateChordbook(
			songId: String!
			userId: String!
			chordbooks: [ChordbookItemInput] # chordbook: ChordbookInput #   chordbook: ChordbookUpdateInput # chordbook: ChordbookInput
		): Chordbook
		addChordbook(chordbook: ChordbookInput): Chordbook
	}
	# enum Status {
	# 	WATCHED
	# 	INTERESTED
	# 	NOT_INTERESTED
	# 	UNKNOWN
	# }

	# type Actor {
	# 	id: ID!
	# 	name: String!
	# }

	# type Movie {
	# 	id: ID!
	# 	title: String!
	# 	releaseDate: Date
	# 	rating: Int
	# 	status: Status
	# 	actor: [Actor]
	# }

	# type Query {
	# 	movies: [Movie]
	# 	movie(id: ID): Movie
	# }

	# input ActorInput {
	# 	id: ID
	# }

	# input MovieInput {
	# 	id: ID
	# 	title: String
	# 	releaseDate: Date
	# 	rating: Int
	# 	status: Status
	# 	actor: [ActorInput]
	# }

	# type Mutation {
	# 	addMovie(movie: MovieInput): [Movie]
	# }

	# type Subscription {
	# 	movieAdded: Movie
	# }
`
