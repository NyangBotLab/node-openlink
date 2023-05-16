import { WebSocket } from 'ws';
import { logger } from '../logger';
import { DefaultConfig, NetworkConfig } from '../config';
import { WsData, WsRequest, WsResponse } from './index';
import { createPacketIdGenerator } from '../packet/packet-id-generator';
import { stringify } from 'lossless-json';
import TypedEmitter from 'typed-emitter/rxjs';
import { EventEmitter } from 'eventemitter3';
import { SocketEvent } from '../event';
import { OkAuthReq } from '../packet/model/ok-auth';

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
        private readonly cookie: string
    ) {
        super();
    }

    async connect() {
        if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
            logger.error('[socket] socket is already open or connecting');
            return;
        }

        this.socket = new WebSocket(`wss://${this.config.socketDomain}${this.config.socketPath}${this.linkId}`);

        await this.initSocket();
    }

    private async initSocket() {
        this.socket.on('message', (e: WsResponse) => {
            logger.debug(`[socket] receive`, e);

            const payload = e.data as unknown as WsResponse;

            const packetId = payload['packetId'] ?? 0;

            this.emit('on_packet', payload as unknown as Record<string, unknown>);

            this.responseListeners.get(packetId)?.call(this, payload);
        });

        // login
        await this.send<OkAuthReq>({
            method: 'OKAUTH',
            authToken: 'Bearer ' + this.cookie,
        })
    }

    async send<T = Record<string, unknown>, R = Record<string, unknown>>(data: T): Promise<R> {
        if (this.socket.readyState !== WebSocket.OPEN) {
            logger.error('[socket] socket is not open');
            return;
        }

        const packetId = this.packetIdGenerator.next();

        const reqData: T & WsData = {
            ...data,
            packetId,
        }

        logger.debug(`[socket] send`, reqData);

        this.socket.send(stringify(reqData));

        return await new Promise((resolve, reject) => {
            this.responseListeners.set(packetId, (data: Record<string, unknown>) => {
                resolve(data as R);
            });
        })
    }

    static async create(config: Partial<NetworkConfig>, linkId: number, cookie: string) {
        const networkConfig = {
            ...DefaultConfig,
            ...config,
        };
        return new OpenlinkSocket(networkConfig, linkId, cookie);
    }

}