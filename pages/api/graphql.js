import { ApolloServer } from "apollo-server-micro";
import { makeExecutableSchema } from "graphql-tools";
import Cors from "micro-cors";
import connectDb from "../../lib/mongoose";
import { chordbookTypeDefs } from "./graphql/chordbook/typedefs.js";
import { userTypeDefs } from "./graphql/user/typedefs.js";
import { chordbookMutations } from "./graphql/chordbook/mutations";
import { chordbookResolvers } from "./graphql/chordbook/resolvers";
import { userMutations } from "./graphql/user/mutations";
import { userResolvers } from "./graphql/user/resolvers";

connectDb();

export const schema = makeExecutableSchema({
  typeDefs: [chordbookTypeDefs, userTypeDefs],
  resolvers: [
    chordbookMutations,
    chordbookResolvers,
    userMutations,
    userResolvers,
  ],
});

const cors = Cors();

export const config = {
  api: {
    bodyParser: false,
  },
};
const server = new ApolloServer({
  schema,
});
const startServer = server.start();

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
});
