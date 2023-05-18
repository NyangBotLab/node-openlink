import { EventEmitter } from 'eventemitter3';
import TypedEmitter from 'typed-emitter/rxjs';
import { ClientEvent, SocketEvent } from '../../event';
import { LoginRes } from '../../api/model/login';
import { OpenlinkSocket } from '../../network/openlink-socket';
import { AllConfig, DefaultConfig } from '../../config';
import { PacketHandler } from '../packet/packet-handler';

export class OpenlinkClient extends (EventEmitter as unknown as new () => TypedEmitter<ClientEvent>) {

    private socket: OpenlinkSocket;
    private packetHandler: PacketHandler = new PacketHandler(this);

    constructor(
        private config: AllConfig,
        private linkId: number,
        private cookie: string
    ) {
        super();
    }

    async login(form: LoginRes) {
        this.socket = await OpenlinkSocket.create(this.config, this.linkId, this.cookie, form);

        await this.socket.connect();

        await this.addPacketHandler();
    }

    private async addPacketHandler() {
        this.socket.on('on_packet', data => {
            this.packetHandler.handle(data);
        })
    }

    static async create(config: Partial<AllConfig>, linkId: number, cookie: string): Promise<OpenlinkClient> {
        return new OpenlinkClient(
            {
                ...DefaultConfig,
                ...config
            },
            linkId,
            cookie
        )
    }

}