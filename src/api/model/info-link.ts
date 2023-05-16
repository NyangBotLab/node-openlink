import { Channel } from '../../channel';

export interface InfoLinkRes {
    id: number;
    name: string;
    description: string;
    type: string;
    coverImageUrl: string;
    iconImageUrl: string;
    status: string;
    memberCount: number;
    channels: Channel[];
    isJoined: boolean;
}