import { WebSocket } from 'ws';
import { logger } from '../logger';
import { DefaultConfig, NetworkConfig } from '../config';
import { WsData, WsRequest, WsResponse } from './index';
import { createPacketIdGenerator } from '../packet/packet-id-generator';
import { parse, stringify } from 'lossless-json';
import TypedEmitter from 'typed-emitter/rxjs';
import { EventEmitter } from 'eventemitter3';
import { SocketEvent } from '../event';

/**
 * This class is responsible for connecting to the Openlink WebSocket.
 */
export class OpenlinkSocket extends (EventEmitter as unknown as new () => TypedEmitter<SocketEvent>) {

    private socket!: WebSocket;
    private packetIdGenerator = createPacketIdGenerator(this.config);

    private responseListeners: Map<number, (data: Record<string, unknown>) => void> = new Map();

    constructor(
        private readonly config: NetworkConfig,
        private readonly linkId: number,
    ) {
        super();
    }

    async connect() {
        if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
            logger.error('[socket] socket is already open or connecting');
            return;
        }

        this.socket = new WebSocket(`wss://${this.config.socketDomain}${this.config.socketPath}${this.linkId}`);
    }

    private initSocket() {
        this.socket.on('message', (e: WsResponse) => {
            logger.debug(`[socket] receive`, e);

            const payload = parse(e['data']) as WsData;

            const packetId = payload['packetId'] ?? 0;

            this.emit('on_packet', payload as unknown as Record<string, unknown>);

            this.responseListeners.get(packetId)?.call(this, payload);
        })
    }

    async send<T = Record<string, unknown>>(data: WsRequest) {
        if (this.socket.readyState !== WebSocket.OPEN) {
            logger.error('[socket] socket is not open');
            return;
        }

        const packetId = this.packetIdGenerator.next();

        const reqData = {
            ...data,
            packetId,
        }

        logger.debug(`[socket] send`, reqData);

        this.socket.send(stringify(reqData));

        return await new Promise((resolve, reject) => {
            this.responseListeners.set(packetId, (data: Record<string, unknown>) => {
                resolve(data as T);
            });
        })
    }

    static async create(config: Partial<NetworkConfig>, linkId: number) {
        const networkConfig = {
            ...DefaultConfig,
            ...config,
        };
        return new OpenlinkSocket(networkConfig, linkId);
    }

}