"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = require("./schema/typeDefs");
const userResolver_1 = require("./resolvers/userResolver");
const transactionResolver_1 = require("./resolvers/transactionResolver");
const app = (0, express_1.default)();
const startApolloServer = async () => {
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: typeDefs_1.typeDefs,
        resolvers: [userResolver_1.userResolver, transactionResolver_1.transactionResolver],
        context: ({ req }) => ({
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
exports.default = app;
