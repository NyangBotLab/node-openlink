import { WsRequest } from '../../network';
import { ChatInfo } from '../../chat';

export interface OkGetMsgReq extends WsRequest {
    method: 'OKGETMSGS'; // method는 이게 맞음
    linkId: number;
    channelId: bigint;
    limit: number;
}

export type OkGetMsgRes = ChatInfo[];