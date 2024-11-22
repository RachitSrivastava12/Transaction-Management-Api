import express, { Application, Request } from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/typeDefs";
import { userResolver } from "./resolvers/userResolver";
import { transactionResolver } from "./resolvers/transactionResolver";

const app: Application = express();

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, transactionResolver],
    context: ({ req }: { req: Request }) => ({
      authToken: req.headers.authorization || "",
    }),
  });

  await server.start();

  server.applyMiddleware({
    app, // Apply middleware with type-safe application
    path: "/graphql",
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startApolloServer().catch((error) => {
  console.error("Error starting server:", error);
});

export default app;
