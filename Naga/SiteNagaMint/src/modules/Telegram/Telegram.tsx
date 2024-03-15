import { $baseApi } from '../../api/api_keystone';


export const connectTg = async (tgName: string, tgUserId: number) => {
    const data = { "tgName": tgName, "tgUserId": tgUserId }
    const response = await $baseApi.post('/telegram/tgAuth', data);
    console.log(response.data)
};

export const loginTg = async (tgName: string, tgUserId: number) => {
    const data = { "tgName": tgName, "tgUserId": tgUserId }
    const response = await $baseApi.post('/telegram/tgLogin', data);
    console.log(response.data)

    
};

export const checkSub = async () => {
    const response = await $baseApi.get('/telegram/checkSub');
    console.log(response.data);
    return (response.data["state"])
};