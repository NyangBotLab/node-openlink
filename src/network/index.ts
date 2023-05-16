export interface WsRequest {
    method: string;
}

export interface WsResponse<T = Record<string, unknown>> {
    data: T;
    method: string;
    packetId: number;
    status: string;
}

export interface WsData {
    packetId: number;
}