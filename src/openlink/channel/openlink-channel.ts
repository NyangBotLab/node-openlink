import { OpenlinkSocket } from '../../network/openlink-socket';
import { Chat } from '../chat';
import { OkWriteReq, OkWriteRes } from '../../packet/model/ok-write';
import { ChatInfo } from '../../chat';

export class OpenlinkChannel {

    constructor(
        private linkId: number,
        private channelId: bigint,
        private socket: OpenlinkSocket
    ) {
    }

    /**
     * 해당 채널에 메시지 보내기
     * @param content
     */
    async reply(content: string | Chat): Promise<ChatInfo> {
        let chat: Chat
        if (typeof content === 'string') {
            chat = {
                linkId: this.linkId,
                channelId: this.channelId,
                type: 'TEXT',
                content
            }
        } else chat = content

        return await this._sendMessage(chat);
    }

    /**
     * 다른 채널에 메시지 보내기
     * @param channelId
     * @param content
     */
    async send(channelId: bigint, content: string | Chat): Promise<ChatInfo> {
        let chat: Chat
        if (typeof content === 'string') {
            chat = {
                linkId: this.linkId,
                channelId,
                type: 'TEXT',
                content
            }
        } else chat = content

        return await this._sendMessage(chat);
    }

    private async _sendMessage(content: Chat): Promise<ChatInfo> {
        return await this.socket.send<OkWriteReq, OkWriteRes>({
            method: 'OKWRITE',
            ...content
        })
    }

}