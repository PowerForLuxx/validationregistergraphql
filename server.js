const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
  }
`;

let users = [
  { id: '1', name: 'Айдын', email: 'aidyn.nurbolat@narxoz.kz' },
  { id: '2', name: 'Aidyn', email: 'Aidyn.Nurbolat@narxoz.kz' },
];

const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    createUser: (_, { name, email, password }) => {
      const newUser = { id: String(users.length + 1), name, email };
      users.push(newUser);
      return newUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
