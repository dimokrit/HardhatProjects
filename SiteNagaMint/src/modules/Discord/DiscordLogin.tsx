import { $baseApi } from '../../api/api_keystone';

export const discordLogin = async () => {
    const loginURL = "https://discord.com/api/oauth2/authorize?client_id=1198900820452851823&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds.members.read"
    window.location.replace(loginURL)
};

export const checkVerify = async () => {
    const response = await $baseApi.get('/discord/checkVerify');
    console.log(response.data)
};