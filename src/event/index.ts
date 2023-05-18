import { OkMsgRes } from '../packet/model/ok-msg';
import { WsResponse } from '../network';

export type SocketEvent = {
    on_packet: (data: WsResponse) => void;
}

export type ClientEvent = {
    message: (data: OkMsgRes) => void;
    on_packet: (data: WsResponse) => void;
}