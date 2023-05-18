import { WebSocket } from 'ws';
import { logger } from '../logger';
import { DefaultConfig, NetworkConfig } from '../config';
import { WsData, WsRequest, WsResponse } from './index';
import { createPacketIdGenerator, PacketIdGenerator } from '../packet/packet-id-generator';
import TypedEmitter from 'typed-emitter/rxjs';
import { EventEmitter } from 'eventemitter3';
import { SocketEvent } from '../event';
import { OkAuthReq } from '../packet/model/ok-auth';
import { OkGetConfigReq, OkGetConfigRes } from '../packet/model/ok-get-config';
import { LoginRes } from '../api/model/login';
import { parse, stringify } from 'json-bigint';

/**
 * This class is responsible for connecting to the Openlink WebSocket.
 */
export class OpenlinkSocket extends (EventEmitter as unknown as new () => TypedEmitter<SocketEvent>) {

    private socket!: WebSocket;
    private packetIdGenerator: PacketIdGenerator;

    private responseListeners: Map<number, (data: Record<string, unknown>) => void> = new Map();

    // 연결 정보
    private confLoaded = false;
    private pingItv!: number;
    private pingTimer!: ReturnType<typeof setInterval>;

    constructor(
        private readonly config: NetworkConfig,
        private readonly linkId: number,
        private readonly cookie: string,
        private readonly form: LoginRes,
    ) {
        super();

        this.packetIdGenerator = createPacketIdGenerator(this.config);
    }

    async connect() {
        if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) {
            logger.error('[socket] socket is already open or connecting');
            return;
        }

        this.socket = new WebSocket(`wss://${this.config.socketDomain}${this.config.socketPath}${this.linkId}`, {
            headers: {
                Origin: 'https://openlink.kakao.com',
                'User-Agent': 'KAKAOTALK;',
                Cookie: this.cookie
            }
        });

        this.socket.onopen = async () => {
            await this.initSocket();
        }
    }

    private async initSocket() {
        this.socket.on('message', (e: Buffer) => {
            logger.debug(`[socket] receive`, e.toString());

            const packet = parse(e.toString()) as WsResponse;

            const payload = packet.data as unknown as Record<string, unknown>;

            const packetId = packet.packetId ?? 0;

            this.emit('on_packet', packet);

            this.responseListeners.get(packetId.valueOf() as number)?.call(this, payload);
        });

        // login
        await this.send<OkAuthReq>({
            method: 'OKAUTH',
            authToken: 'Bearer ' + this.form.accessToken,
        })

        if (!this.confLoaded) {
            await this.loadConf();
        } else {
            this.sendPing(this.pingItv);
        }
    }

    private async loadConf() {
        if (this.confLoaded) return;

        const conf = await this.send<OkGetConfigReq, OkGetConfigRes>({
            method: 'OKGETCONF'
        });

        this.confLoaded = true;

        this.pingItv = conf.connInfo.pingItv;

        this.sendPing(this.pingItv);
    }

    private sendPing(interval: number) {
        if (this.pingTimer) {
            clearTimeout(this.pingTimer);
        }

        this.pingTimer = setInterval(() => {
            this.send({
                method: 'OKPING'
            }).then();
        }, interval * 1000);
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

    static async create(config: Partial<NetworkConfig>, linkId: number, cookie: string, form: LoginRes) {
        const networkConfig = {
            ...DefaultConfig,
            ...config,
        };
        return new OpenlinkSocket(networkConfig, linkId, cookie, form);
    }

}