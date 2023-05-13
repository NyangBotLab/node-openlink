import { NetworkConfig } from '../config';

export function createPacketIdGenerator(config: NetworkConfig): PacketIdGenerator {
    let packetId = Math.floor(Math.random() * config.randomSeed);

    return {
        next() {
            return ++packetId;
        }
    };
}

export interface PacketIdGenerator {

    next(): number;

}