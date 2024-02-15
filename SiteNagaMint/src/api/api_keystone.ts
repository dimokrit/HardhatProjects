import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { config } from "../config";
import { GqlBody } from "../logic/types/request/RequestTypes";

const API_URL = 'http://localhost:5000/api';
//const API_URL = 'http://45.89.190.168/api';

export const $baseApi: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
export class ApiKeystone {
  private static apiGraphql = config.apiGraphql;
  private static apiExpress = config.apiExpress;

  static async queryGraphql(body: GqlBody | FormData) {
    try {
      const config: AxiosRequestConfig = { headers: { "Content-Type": "application/json" }, withCredentials: true }
      const res = await axios.post(this.apiGraphql, body, config)
      console.log("queryGraphql, response success: ", res.data)
      return res.data
    } catch (err) {
      console.log('queryGraphql, response failed:', err)
    }
  }

  static async queryExpress({ body, queryString }: { body?: any, queryString: string }) {
    try {
      let res;
      const config: AxiosRequestConfig = { headers: { "Content-Type": "application/json" }, withCredentials: true }
      if (body) {
        res = await axios.post(this.apiExpress + queryString, body, config)
      } else {
        res = await axios.get(this.apiExpress + queryString, config)
      }
      console.log("queryExpress, response success: ", res.data)
      return res.data
    } catch (err) {
      console.log('queryExpress, response failed:', err)
    }
  }
}