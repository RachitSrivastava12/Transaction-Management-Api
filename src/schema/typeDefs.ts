import { gql } from "apollo-server-express";

export const typeDefs = gql`
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
