import { $baseApi } from '../../api/api_keystone';

export const youtubeSub = async () => {
    const response = await $baseApi.post('/achivments/youtubeSub');
    console.log(response.data)
};

export const youtubeWatch = async () => {
    const response = await $baseApi.post('/achivments/youtubeWatch');
    console.log(response.data)
};

export const instaSub = async () => {
    const response = await $baseApi.post('/achivments/instaSub');
    console.log(response.data)
};

export const genLink = async () => {
    const checkLink = await $baseApi.post('/achivments/checkLink');
    const code = checkLink.data
    console.log(code)
    const link = ("http://localhost/mint?" + code)
    return link
};
