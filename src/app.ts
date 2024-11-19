import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/typeDefs";
import { userResolver } from "./resolvers/userResolver";
import { transactionResolver } from "./resolvers/transactionResolver";
import "./config/setupDB";
import { Request } from "express";

const app: Application = express();

// Add helmet middleware to secure headers
app.use(helmet());

// Custom CSP (Content Security Policy)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Only allow content from the same origin
      scriptSrc: ["'self'", "https://trustedscripts.example.com"], // Allow scripts from the same origin and trusted sources
      imgSrc: ["'self'", "https://example.com"], // Allow images from the same origin and example.com
      styleSrc: ["'self'", "https://trustedstyles.example.com"], // Allow styles from the same origin and trusted sources
      // Add other necessary sources
    },
  })
);

app.use(cors());

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, transactionResolver],
    context: ({ req }) => ({
      authToken: req.headers.authorization || "",
    }),
  });

  await server.start();

  await server.applyMiddleware({
    app: app as any,
    path: '/graphql',
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startApolloServer().catch((error) => {
  console.error('Failed to start server:', error);
});

export default app;
