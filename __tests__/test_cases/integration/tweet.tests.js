const chance = require("chance").Chance();
const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");

describe("Given an authenticated user", () => {
  let user;
  beforeAll(async () => {
    user = await given.an_authenticated_user();
  });

  describe("When he sends a tweet", () => {
    let tweet;
    const text = chance.string({ length: 16 });
    beforeAll(async () => {
      tweet = await when.we_invoke_tweet(user.username, text);
    });

    it("Saves the tweet in the tweets table", async () => {
      await then.tweet_exists_in_TweetsTable(tweet.id);
    });
    it("Saves the tweet in the timalinest table", async () => {
      await then.tweet_exists_in_TimelinesTable(user.username, tweet.id);
    });
    it("Increments tweet count in the users table by 1", async () => {
      await then.tweetCount_is_updated_in_UsersTable(user.username, 1);
    });
  });
});
