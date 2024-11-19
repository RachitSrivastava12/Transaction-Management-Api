import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/typeDefs";
import { userResolver } from "./resolvers/userResolver";
import { transactionResolver } from "./resolvers/transactionResolver";
import "./config/setupDB";
import { Request } from "express";
import {Response} from "express";

const app: Application = express();

// Add helmet middleware with GraphQL-friendly CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Configure CORS
app.use(cors());

// Add a root route handler
app.get("/", (req : Request, res: Response) => {
  res.json({ 
    message: "API is running", 
    documentation: "/graphql" 
  });
});

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, transactionResolver],
    context: ({ req }) => ({
      authToken: req.headers.authorization || "",
    }),
    introspection: true,  // Enable introspection for production
  });

  await server.start();
  
  server.applyMiddleware({
    app: app as any,
    path: '/graphql',
    cors: {
      origin: '*',
      credentials: true
    }
  });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📊 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startApolloServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1); // Exit on startup failure
});

export default app;