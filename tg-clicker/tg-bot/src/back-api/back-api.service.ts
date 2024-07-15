// BackApiService.ts

import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BackApiService {
  constructor(public readonly request: HttpService) {
    request.axiosRef.interceptors.response.use(
      (response) => {
        console.log(
          `BackApi response ${response.config.url} ${JSON.stringify(
            response?.data,
          )}`,
        );
        return response;
      },
      (error: AxiosError) => {
        console.error(
          `BackApi ${error.code} ${error.config.url} ${JSON.stringify(
            error.response?.data,
          )}`,
        );

        throw new HttpException(error.response.data, error.response.status);
      },
    );
  }

  async sendPostRequest(url: string, data: any, headers?: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.request.post(url, data, { headers })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(error.response?.data, error.response?.status);
      }
      throw error;
    }
  }
}
