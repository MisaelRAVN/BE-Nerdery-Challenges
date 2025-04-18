/*

  Challenge 3: Most Common Subscription for Harsh Reviewers

  Find the most common subscription among users who dislike more movies than they like.
  Use the methods in utils/mocked-api to get user and rating data.
  Check each user's likes vs. dislikes, filter those with more dislikes, and return the most frequent subscription.

  Requesites:
    - Use await with the methods from utils/mocked-api to get the data
    - Make sure to return a string containing the name of the most common subscription
*/

const {
  getUsers,
  getLikedMovies,
  getDislikedMovies,
  getUserSubscriptionByUserId,
} = require("./utils/mocked-api");

/**
 * Logs the most common subscription among users
 * who disliked more movies than they liked.
 *
 * @returns {Promise<string>} Logs the subscription name as a string.
 */
const getCommonDislikedSubscription = async () => {
  const harshestUsers = [];
  const [users, likedMovies, dislikedMovies] = await Promise.all([
    getUsers(),
    getLikedMovies(),
    getDislikedMovies(),
  ]);

  const getUserRatedMoviesCount = (user, movies) => {
    const userRatedMovies = movies.find(
      (ratedMovie) => ratedMovie.userId === user.id,
    );
    const userRatedMoviesCount = userRatedMovies?.movies.length ?? 0;
    return userRatedMoviesCount;
  };

  for (const user of users) {
    const [dislikedMoviesCount, likedMoviesCount] = [
      getUserRatedMoviesCount(user, dislikedMovies),
      getUserRatedMoviesCount(user, likedMovies),
    ];

    if (dislikedMoviesCount > likedMoviesCount) {
      harshestUsers.push(user);
    }
  }

  const subscriptionsPromises = harshestUsers.map((user) =>
    getUserSubscriptionByUserId(user.id),
  );
  const subscriptions = await Promise.all(subscriptionsPromises);
  const subscriptionsSummary = subscriptions.reduce((acc, curr) => {
    acc[curr.subscription] = (acc[curr.subscription] ?? 0) + 1;
    return acc;
  }, {});

  const mostCommonSubscription = Object.entries(subscriptionsSummary).reduce(
    (prev, curr) => {
      const [prevSubscriptionCount, currSubscriptionCount] = [prev[1], curr[1]];
      return prevSubscriptionCount > currSubscriptionCount ? prev : curr;
    },
  );

  return mostCommonSubscription[0];
};

getCommonDislikedSubscription()
  .then((subscription) => {
    console.log("Common more dislike subscription is:", subscription);
  })
  .catch((error) => console.log(error));
