export interface Channel {
    id: bigint;
    name: string;
    type: string;
    position: number;
    status: string;
    useSafeBot: boolean;
}