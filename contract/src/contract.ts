// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, UnorderedMap } from "near-sdk-js";
import { IndexRouteProps } from "react-router-dom";

@NearBindgen({})
class WidgetRatingTool {
  // what does this need to do?

  // It needs to track if a user has already participated in a particular rating
  userRatingTracker = new UnorderedMap<string[]>("rating_tracker");

  // keep track of the rating that the user gave a widget
  userRatingObject = new UnorderedMap<any>("user_ranking");

  // keep track of each individual rating and return an average
  rankingArrayTracker = new UnorderedMap<number[]>("ranking array tracker");

  // keep track of user comments

  // For now I'm going to focus on functionality over efficiency and optimize a bit later

  // Call methods

  @call({})
  newRanking(rateVal: number, widgetName: string) {
    let user = near.signerAccountId();

    // first see if user has already taken part in this particular poll
    let widgetUserList = this.userRatingTracker.get(widgetName, {
      defaultValue: [],
    });

    // get current list if any of the rankings for a widget
    let rankingArray = this.rankingArrayTracker.get(widgetName, {
      defaultValue: [],
    });

    // get user's voting Object Info
    let userObject = this.userRatingObject.get(user, {
      defaultValue: {},
    });

    if (widgetUserList.includes(user)) {
      near.log("add new ranking");

      // adding new user
      widgetUserList.push(user);
      this.userRatingTracker.set(widgetName, widgetUserList);

      // adding user rating
      rankingArray.push(rateVal / 10);

      // update userVote Object
      let rateIndex = rankingArray.length - 1;
      rateIndex = rateIndex === -1 ? 0 : rateIndex;
      //// update rating widget object
      userObject[widgetName] = {
        index: rateIndex,
        rating: rateVal,
      };
    } else {
      near.log("updating ranking");

      // get userVote Object Index value
      let rateIndex = userObject[widgetName];

      // update ranking in array and object
      rankingArray[rateIndex] = rateVal;
      userObject.rating = rateVal;
    }
  }

  // View Methods

  @view({})
  getVoteObject({
    user,
    widgetName,
  }: {
    user: string;
    widgetName: string;
  }): any {
    near.log("getting user Rating Object");
    let userObject = this.userRatingObject.get(user, {
      defaultValue: {},
    });

    return userObject[widgetName];
  }

  @view({})
  getVoteAverage({ widgetName }: { widgetName: string }): number {
    let rateList = this.rankingArrayTracker.get(widgetName);

    let sum = 0;
    rateList.forEach((el) => {
      sum = sum + el;
    });
    let average = sum / rateList.length;
    return average;
  }

  @view({})
  userParticipation({
    widgetName,
    user,
  }: {
    widgetName: string;
    user: string;
  }): boolean {
    let userList = this.userRatingTracker.get(widgetName, { defaultValue: [] });
    return userList.includes(user);
  }
}
