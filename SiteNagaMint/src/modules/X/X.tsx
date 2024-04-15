import { $baseApi } from '../../api/api_keystone';

export async function getXOauthUrl() {
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const clientId = "U2d3YkFjNWxwZy1DaFlJN0psbE06MTpjaQ"
  const options = {
    client_id: clientId,
    scope: ["users.read", "tweet.read", "follows.read", "follows.write"].join(" "),
    response_type: "code",
    redirect_uri: "http://localhost:5000/api/x/callback", 
    state: "state",
    code_challenge: "challenge",
    code_challenge_method: "plain",
  };
  const qs = new URLSearchParams(options).toString();
  console.log(`${rootUrl}?${qs}`)
  window.location.replace(`${rootUrl}?${qs}`);
}

export async function checkX_sub() {
  const response = await $baseApi.get('/X/checkSub');
  console.log(response.data);
  return (response.data["state"])
}

export async function checkX_like() {
  const response = await $baseApi.get('/X/checkLike');
  console.log(response.data);
  return (response.data["state"])
}

export async function checkX_retweet() {
  const response = await $baseApi.get('/X/checkRetweet');
  console.log(response.data);
  return (response.data["state"])
}

