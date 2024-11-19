import express, { Application } from "express";  // Note the added Application import
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/typeDefs";
import { userResolver } from "./resolvers/userResolver";
import { transactionResolver } from "./resolvers/transactionResolver";
import "./config/setupDB";
import { Request } from "express";

// Explicitly type the app as Application
const app: Application = express();

app.use(cors());

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, transactionResolver],
    context: ({ req} : {req: Request}) => ({
      authToken: req.headers.authorization || ""
    }),
  });

  await server.start();

  // Use proper typing for applyMiddleware
  await server.applyMiddleware({ 
    app: app as any, // Type assertion to bypass strict type checking
    path: '/graphql'
  });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startApolloServer().catch(error => {
  console.error('Failed to start server:', error);
});

export default app;