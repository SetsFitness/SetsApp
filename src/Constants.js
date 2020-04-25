export const ifDebug = true;
export let log = true;
export let err = true;
export const ifAlert = false;
export const reduxLog = true;
export const ifCallLambdaAtStart = false;
export const theme = "light";

export const setLog = l => log = l;
export const setErr = e => err = e;

// export const getEnvironmentType = () => "production";
export const getEnvironmentType = () => process.env.NODE_ENV;

// Don't touch this
export const appUserItemType = "Client";

export const lambdaFunctionName = "VastusMainLambdaFunction";

export const userInitialFetchList = ["name", "username", "birthday", "profileImagePath",
  "profileImagePaths", "challengesWon", "friends", "friendRequests", "scheduledEvents",
  "ownedEvents", "completedEvents", "challenges", "ownedChallenges", "completedChallenges",
  "groups", "ownedGroups", "receivedInvites", "invitedChallenges", "messageBoards", "streaks"];