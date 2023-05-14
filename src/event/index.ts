export type SocketEvent = {
    on_packet: (data: Record<string, unknown>) => void;
}