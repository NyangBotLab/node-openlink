import { WsResponse } from '../../network';
import TypedEmitter from 'typed-emitter/rxjs';
import { ClientEvent } from '../../event';
import { OkMsgRes } from '../../packet/model/ok-msg';

export class PacketHandler {

    constructor(
        private client: TypedEmitter<ClientEvent>
    ) {
    }

    async handle(response: WsResponse) {
        this.client.emit('on_packet', response)

        switch (response.method) {
            case 'OKMSG': {
                this.client.emit('message', response.data as unknown as OkMsgRes);
                break;
            }

            default: {
                break;
            }
        }
    }

}