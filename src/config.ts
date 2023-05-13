export const DefaultConfig: AllConfig = {
    socketDomain: 'cbt-chat-openlink.kakao.com',
    socketPath: '/socket/okay/v1/links/',
    randomSeed: 10000,
}

export interface NetworkConfig {
    socketDomain: string;
    socketPath: string;
    randomSeed: number;
}

export type AllConfig = NetworkConfig;