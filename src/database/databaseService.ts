import { database } from "./database";
import { databaseAdapter } from "./databaseAdapter";
import { FeedItemProps } from "./types";

async function getFeedList(): Promise<FeedItemProps[]> {
  const response = await database.getFeed();
  return response.map(databaseAdapter.fromDbToFeedItem);
}

export const databaseService = {
  getFeedList
}