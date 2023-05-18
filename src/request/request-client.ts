import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { ProcessResponse } from './index';

export class RequestClient {

    private client: AxiosInstance;

    constructor(
        public scheme: 'http' | 'https',
        public host: string,
    ) {
        this.client = axios.create()
    }

    get url(): string {
        return `${this.scheme}://${this.host}`;
    }

    getApiURL(path: string): string {
        return `${this.url}${path}`;
    }

    async request(
        method: Method,
        path: string,
        form?: Record<string, unknown> | string | Record<string, unknown>[],
        headers?: Record<string, string>,
    ): ProcessResponse<AxiosResponse> {
        try {
            const reqData = this.build(method, headers);

            if (form) {
                if (method === 'GET' || method === 'get') {
                    reqData['url'] = this.getApiURL(path);
                } else {
                    reqData.data = form;
                    reqData['url'] = this.getApiURL(path);
                }
            }

            const res = await this.client.request(reqData) as AxiosResponse;

            if (res.status !== 200) {
                return { success: false, status: res.status }
            }

            return { success: true, status: res.status, result: res };
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return { success: false, status: e.status }
            }
            return { success: false, status: -100 };
        }
    }

    async requestData<T = Record<string, unknown>>(
        method: Method,
        path: string,
        form?: Record<string, unknown> | Record<string, unknown>[] | string,
        headers?: Record<string, string>,
    ): Promise<T> {
        const res = await this.request(method, path, form, headers);

        if (!res.success) {
            throw new Error(`Web Request Error with status: ${res.status}`);
        }

        return JSON.parse(res.result.data as string);
    }

    private build(method: Method, header?: Record<string, string>): AxiosRequestConfig {
        const headers: Record<string, string> = {};
        headers['Host'] = this.host;
        headers['Accept-Encoding'] = 'gzip, deflate';
        headers['Accept-Language'] = 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7';

        if (header) Object.assign(headers, header);

        return {
            headers,
            method,
            responseType: 'text',
        }
    }
    
}