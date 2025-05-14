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
  const [users, likedMovies, dislikedMovies] = await Promise.all([
    getUsers(),
    getLikedMovies(),
    getDislikedMovies(),
  ]);

  const getMovieCountMapByUserId = (movies) => {
    return movies.reduce((acc, curr) => {
      acc.set(curr.userId, curr.movies?.length ?? 0);
      return acc;
    }, new Map());
  };

  const likedMoviesCount = getMovieCountMapByUserId(likedMovies);
  const dislikedMoviesCount = getMovieCountMapByUserId(dislikedMovies);

  const harshestUsers = users.filter((user) => {
    const likes = likedMoviesCount.get(user.id) ?? 0;
    const dislikes = dislikedMoviesCount.get(user.id) ?? 0;
    return dislikes > likes;
  });

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
