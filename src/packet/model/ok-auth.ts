import { WsRequest, WsResponse } from '../../network';

export interface OkAuthReq extends WsRequest {
    method: 'OKAUTH';
    authToken: string;
}

export interface OkAuthRes {
    id: number; // userId
    status: string; // 정지 여부 판단?
}