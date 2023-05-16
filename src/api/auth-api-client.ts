import { AllConfig, DefaultConfig } from '../config';
import { LoginRes } from './model/login';
import { RequestClient } from '../request/request-client';

export class AuthApiClient {

    private client = new RequestClient('https', 'openlink.kakao.com');

    private constructor(
        private readonly config: AllConfig,
        private readonly cookie: string
    ) {
    }

    async login(): Promise<LoginRes> {
        return await this.client.requestData<LoginRes>(
            'POST',
            '/api/user/v1/light/auth/login',
            {},
            {
                Cookie: this.cookie,
            }
        )
    }

    static async create(config: Partial<AllConfig>, cookie: string): Promise<AuthApiClient> {
        return new AuthApiClient({
            ...DefaultConfig,
            ...config,
        }, cookie);
    }

}