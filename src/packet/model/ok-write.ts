import { WsRequest } from '../../network';
import { ChatInfo } from '../../chat';
import { Image } from '../../media/image';

export interface OkWriteReq extends WsRequest {
    method: 'OKWRITE';
    linkId: number;
    channelId: bigint;
    type: 'TEXT' | 'IMAGE' | string;
    content: string;
    originalImages?: Image[];
    thumbnailImages?: Image[];
    everyMention?: boolean;
}

export type OkWriteRes = ChatInfo;