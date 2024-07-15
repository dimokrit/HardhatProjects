import axios, { AxiosInstance } from 'axios';
import { config } from 'dotenv';

export const $baseApi: AxiosInstance = axios.create({
  baseURL: config().parsed.BACK_API_URL,
  withCredentials: true,
});
