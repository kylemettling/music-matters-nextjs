import { gql } from "apollo-server-micro";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String
    userObjectId: String
    chordbooks: [Chordbook]
    createdAt: Date
    avatar: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
    # userChordbook(songId: String, userObjectId: ID!): Chordbook
    # userChordbooks(userObjectId: ID!): [Chordbook]
  }

  input UserInput {
    id: ID
    name: String
    email: String
    userObjectId: String
    chordbooks: [ChordbookInput]
    createdAt: Date
    avatar: String
  }

  type Mutation {
    addUser(input: UserInput): User
    # addUserChordbook(id: ID!, chordbookId: ID!): Chordbook
  }
`;
