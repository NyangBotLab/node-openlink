import { OkMsgRes } from '../packet/model/ok-msg';
import { WsResponse } from '../network';
import { OpenlinkChannel } from '../openlink/channel/openlink-channel';

export type SocketEvent = {
    on_packet: (data: WsResponse) => void;
}

export type ClientEvent = {
    message: (channel: OpenlinkChannel, data: OkMsgRes) => void;
    on_packet: (data: WsResponse) => void;
}