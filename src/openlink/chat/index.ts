import { ChatType } from '../../chat';
import { Image } from '../../media/image';

export interface Chat {
    channelId: bigint;
    content: string;
    everyMention?: boolean;
    linkId: number; // 채팅에 포함되긴 하나 권장하진 않음
    mentions?: unknown[]; // 아직 타입을 모르기에 보류
    type: ChatType;
    originalImages?: Image[];
    thumbnailImages?: Image[];
}