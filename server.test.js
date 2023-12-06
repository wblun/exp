const request = require('supertest');
const app = require('../gql/server'); // Replace with the correct path to your server file

describe('GraphQL Server Tests', () => {
  describe('Query scenarios', () => {
    it('should return top 5 movies with specific attributes', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: `
            {
              topMovies {
                title
                year
                imdbID
              }
            }
          `,
        })
        .expect(200);

      const { data } = response.body;
      expect(data.topMovies).toHaveLength(5);
      expect(data.topMovies[0]).toHaveProperty('title');
      expect(data.topMovies[0]).toHaveProperty('year');
      expect(data.topMovies[0]).toHaveProperty('imdbID');
      expect(data.topMovies[0]).not.toHaveProperty('type');
      expect(data.topMovies[0]).not.toHaveProperty('poster');
    });

    it('should return top 5 movies with different attributes', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: `
            {
              topMovies {
                title
                year
                imdbID
                poster
              }
            }
          `,
        })
        .expect(200);

      const { data } = response.body;
      expect(data.topMovies).toHaveLength(5);
      expect(data.topMovies[0]).toHaveProperty('title');
      expect(data.topMovies[0]).toHaveProperty('year');
      expect(data.topMovies[0]).toHaveProperty('imdbID');
      expect(data.topMovies[0]).toHaveProperty('poster');
      expect(data.topMovies[0]).not.toHaveProperty('type');
    });

    it('should handle missing attributes gracefully', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: `
            {
              topMovies {
                title
                year
              }
            }
          `,
        })
        .expect(200);

      const { data } = response.body;
      expect(data.topMovies).toHaveLength(5);
      expect(data.topMovies[0]).toHaveProperty('title');
      expect(data.topMovies[0]).toHaveProperty('year');
      expect(data.topMovies[0]).not.toHaveProperty('imdbID');
      expect(data.topMovies[0]).not.toHaveProperty('type');
      expect(data.topMovies[0]).not.toHaveProperty('poster');
    });
  });

  describe('Mutation scenarios', () => {
    it('should handle mutation with all mandatory parameters', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: `
            mutation {
              addMovie(title: "Inception", year: "2010", imdbID: "tt1375666", type: "movie", poster: "https://example.com/inception.jpg") {
                title
                year
                imdbID
                type
                poster
              }
            }
          `,
        })
        .expect(200);

      const { data } = response.body;
      expect(data.addMovie).toHaveProperty('title', 'Inception');
      expect(data.addMovie).toHaveProperty('year', '2010');
      expect(data.addMovie).toHaveProperty('imdbID', 'tt1375666');
      expect(data.addMovie).toHaveProperty('type', 'movie');
      expect(data.addMovie).toHaveProperty('poster', 'https://example.com/inception.jpg');
    });
it('should handle mutation with missing or incorrect parameters', async () => {
  const response = await request(app)
    .post('/graphql')
    .send({
      query: `
        mutation {
          addMovie(title: "Incomplete Movie", year: "2023") {
            title
            year
            imdbID
            type
            poster
          }
        }
      `,
    })
    .expect(400);

  const { data, errors } = response.body;

  // Check if errors exist, indicating a GraphQL validation error
  if (errors) {
    expect(errors[0].message).toContain('Field "addMovie" argument "imdbID" of type "String!" is required, but it was not provided.');
  } else {
    // If there are no errors, check if data is defined and addMovie is null
    expect(data).toBeDefined();
    expect(data.addMovie).toBeNull();
  }
});

  });
});
