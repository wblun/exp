const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

// Static data for the top 5 movies
let staticTopMovies = [
  {
    title: 'The Shawshank Redemption',
    year: '1994',
    imdbID: 'tt0111161',
    type: 'movie',
    poster: 'https://example.com/poster1.jpg',
  },
  {
    title: 'The Godfather',
    year: '1972',
    imdbID: 'tt0068646',
    type: 'movie',
    poster: 'https://example.com/poster2.jpg',
  },
  {
    title: 'The Dark Knight',
    year: '2008',
    imdbID: 'tt0468569',
    type: 'movie',
    poster: 'https://example.com/poster3.jpg',
  },
  {
    title: 'Pulp Fiction',
    year: '1994',
    imdbID: 'tt0110912',
    type: 'movie',
    poster: 'https://example.com/poster4.jpg',
  },
  {
    title: 'Schindler\'s List',
    year: '1993',
    imdbID: 'tt0108052',
    type: 'movie',
    poster: 'https://example.com/poster5.jpg',
  },
];

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: {
    title: { type: GraphQLString },
    year: { type: GraphQLString },
    imdbID: { type: GraphQLString },
    type: { type: GraphQLString },
    poster: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    topMovies: {
      type: new GraphQLList(MovieType),
      resolve: () => staticTopMovies,
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    addMovie: {
      type: MovieType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        year: { type: new GraphQLNonNull(GraphQLString) },
        imdbID: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        poster: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        const newMovie = { ...args };
        staticTopMovies = [...staticTopMovies, newMovie];
        return newMovie;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});

module.exports = app; // Export for testing
