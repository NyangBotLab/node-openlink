import { WsRequest } from '../../network';

export interface OkMsgCountReq extends WsRequest {
    method: 'OKMSGCOUNT'
    linkId: number;
    channelId: bigint;
}

export interface OkMsgCountRes {
    channelId: bigint;
    count: number;
    linkId: number;
}