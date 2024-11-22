Transaction Management API

Welcome to the Transaction Management API! This API allows users to manage transactions efficiently with features like authentication, caching, and GraphQL-based querying.
Tech Stack and Frameworks Used
Backend:

    Node.js: JavaScript runtime environment.
    TypeScript: For static typing and improved code reliability.
    Express: Lightweight web framework for building the API.
    GraphQL: API query language for flexible data fetching.
    Apollo Server: Integration with Express for GraphQL APIs.
    TypeORM: Object-Relational Mapping (ORM) for PostgreSQL.
    Redis: In-memory caching for improved performance.
    PostgreSQL: Relational database for storing transactional data.

Tools and Libraries:

    bcryptjs: For secure password hashing.
    jsonwebtoken: For generating and verifying JWTs.
    dotenv: For managing environment variables securely.
    reflect-metadata: For TypeScript metadata reflection.

Features

    User Authentication: Secure user sign-up and login using JWTs.
    Transaction Management: Create, update, view, and delete transactions.
    Caching: Improved API response times using Redis caching.
    GraphQL Integration: Flexible data queries with GraphQL schemas and resolvers.
    Database Management: Seamless database interaction using TypeORM.

Future Enhancements

    Deployment: Deploy the API using platforms like AWS, Render, or Vercel.
    Advanced Caching: Introduce cache invalidation mechanisms for better data accuracy.
    Pagination and Filtering: Add features to paginate and filter transactions.
    Integration with Frontend: Build a React-based frontend for consuming this API.

Installation and Running Locally
Install Dependencies:

npm install

Set Up Environment Variables:

Create a .env file in the root directory with the following content:

DATABASE_URL=<your_postgresql_connection_string>
REDIS_URL=<your_redis_connection_string>
JWT_SECRET=<your_jwt_secret_key>
PORT=3000

Run the Application:

Start the server:

npm run dev

The API will be available at: http://localhost:3000/graphql.
Dependencies

The following dependencies are required for this project:
Main Dependencies:

    apollo-server-express: To integrate Apollo Server with Express.
    bcryptjs: For hashing user passwords.
    cors: To enable cross-origin requests.
    dotenv: To manage environment variables securely.
    express: A lightweight framework for building the API.
    graphql: The core library for GraphQL API implementation.
    jsonwebtoken: To generate and verify JWTs for authentication.
    pg: PostgreSQL client for Node.js.
    redis: Library for connecting to a Redis server.
    reflect-metadata: Used with TypeScript for metadata reflection.
    type-graphql: A library for creating GraphQL schemas in TypeScript.
    typeorm: ORM for managing PostgreSQL databases in TypeScript.

Dev Dependencies:

    @types/bcryptjs: Type definitions for bcryptjs.
    @types/cors: Type definitions for cors.
    @types/jsonwebtoken: Type definitions for jsonwebtoken.
    @types/node: Type definitions for Node.js.
    typescript: TypeScript compiler.

Install all dependencies with:

npm install

Major Learnings

While developing this API, I gained several key insights:

    TypeScript: Enhanced my understanding of static typing and code reliability.
    GraphQL: Learned to design schemas and resolvers for efficient API development.
    Caching: Improved response times with Redis caching.
    Authentication: Implemented secure user authentication using JWT.
    Error Handling: Built robust error-handling mechanisms for APIs.
    GraphQL: Migrated from traditional RESTful APIs to GraphQL for better data handling.
