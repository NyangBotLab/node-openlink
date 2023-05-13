import { WebSocket } from 'ws';
import { logger } from '../logger';
import { DefaultConfig, NetworkConfig } from '../config';
import { WsRequest } from './index';
import { createPacketIdGenerator } from '../packet/packet-id-generator';
import { parse, stringify } from 'lossless-json';

/**
 * This class is responsible for connecting to the Openlink WebSocket.
 */
export class OpenlinkSocket {

    private socket!: WebSocket;
    private packetIdGenerator = createPacketIdGenerator(this.config);

    constructor(
        private readonly config: NetworkConfig,
        private readonly linkId: number,
    ) {
    }

    async connect() {
        if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
            logger.error('[socket] socket is already open or connecting');
            return;
        }

        this.socket = new WebSocket(`wss://${this.config.socketDomain}${this.config.socketPath}${this.linkId}`);
    }

    private initSocket() {
        this.socket.on('message', e => {
            logger.debug(`[socket] receive`, e);

            const payload = parse(e['data']);
        })
    }

    async send(data: WsRequest) {
        if (this.socket.readyState !== WebSocket.OPEN) {
            logger.error('[socket] socket is not open');
            return;
        }

        const reqData = {
            ...data,
            packetId: this.packetIdGenerator.next(),
        }

        logger.debug(`[socket] send`, reqData);

        this.socket.send(stringify(reqData));
    }

    static async create(config: Partial<NetworkConfig>, linkId: number) {
        const networkConfig = {
            ...DefaultConfig,
            ...config,
        };
        return new OpenlinkSocket(networkConfig, linkId);
    }

}