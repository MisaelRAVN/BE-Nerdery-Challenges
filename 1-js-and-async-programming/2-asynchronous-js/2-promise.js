/*
  Challenge 2: Users Who Dislike More Movies Than They Like

  Get a list of users who have rated more movies negatively than positively.

  Use the methods in utils/mocked-api to retrieve user and rating data.
  Check how many movies each user liked and disliked, then return only those with more dislikes.

  Requirements:
  - Use only Promise static methods (e.g., Promise.all, Promise.then, etc.) to handle the results
  - Only print the user information in the output—no extra text or formatting

 */

const {
  getUsers,
  getLikedMovies,
  getDislikedMovies,
} = require("./utils/mocked-api");

/**
 * @typedef {Object} User
 * @property {number} id - The unique identifier for the user.
 * @property {string} name - The name of the user.
 * @property {number} age - The age of the user.
 */

/**
 * Logs and returns the users who dislike more movies than they like.
 *
 * @returns {Promise<User[]>} A promise that resolves to an array of users who dislike more movies than they like.
 */
const getUsersWithMoreDislikedMoviesThanLikedMovies = () => {
  return Promise.all([getUsers(), getLikedMovies(), getDislikedMovies()])
    .then(([users, likedMovies, dislikedMovies]) => {
      const getMovieCountMapByUserId = (movies) => {
        return movies.reduce((acc, curr) => {
          acc.set(curr.userId, curr.movies?.length ?? 0);
          return acc;
        }, new Map());
      };

      const likedMoviesCount = getMovieCountMapByUserId(likedMovies);
      const dislikedMoviesCount = getMovieCountMapByUserId(dislikedMovies);

      return users.filter((user) => {
        const likes = likedMoviesCount.get(user.id) ?? 0;
        const dislikes = dislikedMoviesCount.get(user.id) ?? 0;
        return dislikes > likes;
      });
    })
    .catch((error) => console.log(error));
};

getUsersWithMoreDislikedMoviesThanLikedMovies()
  .then((users) => {
    console.log("Users with more disliked movies than liked movies:");
    users.forEach(({ id, name, age }) => {
      console.log(id, name, age);
    });
  })
  .catch((error) => console.log(error));
