export interface WsRequest {
    method: string;
}

export interface WsResponse {
    data: string;
}

export interface WsData {
    packetId: number;
}