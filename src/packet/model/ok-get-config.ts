import { WsRequest } from '../../network';

export interface OkGetConfigReq extends WsRequest {
    method: 'OKGETCONF';
}

export interface OkGetConfigRes {
    connInfo: {
        cacheTimeout: number;
        pingItv: number;
        reqTimeout: number;
    }
}