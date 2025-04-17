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
  getDislikedMovies
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
  let harshestUsers = [];
  return new Promise((resolve, reject) => {
    Promise.all([
      getUsers(),
      getLikedMovies(),
      getDislikedMovies()
    ])
    .then(([users, likedMovies, dislikedMovies]) => {
      for (const user of users) {
        const userLikedMovies = likedMovies.find(
          (likedMovie) => likedMovie.userId === user.id
        );
        const likedMoviesCount = userLikedMovies?.movies.length ?? 0;

        const userDislikedMovies = dislikedMovies.find(
          (dislikedMovie) => dislikedMovie.userId === user.id
        );
        const dislikedMoviesCount = userDislikedMovies?.movies.length ?? 0;

        if (dislikedMoviesCount > likedMoviesCount)
          harshestUsers.push(user);
      }
    })
    .catch(error => reject(error))
    .finally(() => resolve(harshestUsers));
  });
};

getUsersWithMoreDislikedMoviesThanLikedMovies().then((users) => {
  console.log("Users with more disliked movies than liked movies:");
  users.forEach(({ id, name, age }) => {
    console.log(id, name, age);
  });
});
