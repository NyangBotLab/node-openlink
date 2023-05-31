import { WsResponse } from '../../network';
import TypedEmitter from 'typed-emitter/rxjs';
import { ClientEvent } from '../../event';
import { OkMsgRes } from '../../packet/model/ok-msg';
import { OpenlinkChannel } from '../channel/openlink-channel';
import { OpenlinkClient } from '../client/openlink-client';

export class PacketHandler {

    constructor(
        private client: OpenlinkClient
    ) {
    }

    async handle(response: WsResponse) {
        this.client.emit('on_packet', response)

        switch (response.method) {
            case 'OKMSG': {
                const chat = response.data as unknown as OkMsgRes;
                const channel = new OpenlinkChannel(chat.linkId, chat.channelId, this.client.socket)
                this.client.emit('message', channel, chat);
                break;
            }

            default: {
                break;
            }
        }
    }

}