import { $baseApi } from '../../api/api_keystone';

export const connectGoogle = async () => {
    const response = await $baseApi.post('/gmail/gmailAuth');
    window.location.replace(response.data["url"])
};

export const loginGmail = async () => {
    const code = ((window.location.href).toString()).split('?')[1]
    const data = { "code": code }
    console.log(code)
    const response = await $baseApi.post('/gmail/gmailLogin', data);
    window.location.replace(response.data["url"])
};