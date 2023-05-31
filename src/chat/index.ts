import { LinkUser } from '../user';
import { Image } from '../media/image';

/**
 * 가공되지 않은 날것 그대로
 */
export interface ChatInfo {
    channelId: bigint;
    content: string;
    createdAt: string;
    everyMention: boolean;
    id: bigint;
    linkId: number;
    linkMember: LinkUser;
    mentions: unknown[]; // TODO: 타입을 밝혀내자!
    status: 'SHOW' | 'DELETE_USER' | 'BLOCK_BY_SAFEBOT' | string;
    type: ChatType;
    updatedAt: string;
    originalImages?: Image[];
    thumbnailImages?: Image[];
}

export type ChatType = 'TEXT' | 'IMAGE' | string;