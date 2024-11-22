"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  scalar JSON

  type User {
    id: ID!
    email: String!
    password: String!
    balance: JSON
  }

  type Transaction {
    id: ID!
    user_id: Int!
    amount: Float!
    currency: String!
    type: String!
    created_at: String!
    user: User!
  }

  type Query {
    getUser(id: Int!): User
    getTransactions(userId: Int!): [Transaction]
  }

  type Mutation {
    register(email: String!, password: String!): String
    login(email: String!, password: String!): String
    createTransaction(userId: Int!, amount: Float!, currency: String! type: String!): String
  }
`;
