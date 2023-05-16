import { WsRequest } from '../../network';
import { ChatInfo } from '../../chat';

export interface OkWriteReq extends WsRequest {
    method: 'OKWRITE';
    linkId: number;
    channelId: bigint;
    type: 'TEXT' | 'IMAGE' | string;
    content: string;
}

export type OkWriteRes = ChatInfo;