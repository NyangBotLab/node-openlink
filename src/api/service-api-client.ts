import { AllConfig, DefaultConfig } from '../config';
import { InfoLinkRes } from './model/info-link';
import { RequestClient } from '../request/request-client';

export class ServiceApiClient {

    private client = new RequestClient('https', 'openlink.kakao.com');

    private constructor(
        private readonly config: AllConfig,
        private readonly cookie: string
    ) {
    }

    async infoLink(linkId: number): Promise<InfoLinkRes> {
        return await this.client.requestData<InfoLinkRes>(
            'GET',
            `/api/link/v1/light/links/${linkId}`,
            {},
            {
                Cookie: this.cookie,
            }
        )
    }

    static async create(config: Partial<AllConfig>, cookie: string): Promise<ServiceApiClient> {
        return new ServiceApiClient({
            ...DefaultConfig,
            ...config,
        }, cookie);
    }

}