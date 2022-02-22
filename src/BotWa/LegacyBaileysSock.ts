import { AnyMessageContent, AppStateChunk, AuthenticationCreds, BaileysEventEmitter, BinaryNode, Chat, ChatModification, ConnectionState, Contact, DisconnectReason, GroupMetadata, LegacyAuthenticationCreds, LegacyBaileysEventEmitter, MediaConnInfo, MessageRelayOptions, MiscMessageGenerationOptions, ParticipantAction, SignalKeyStoreWithTransaction, SocketQueryOptions, SocketSendMessageOptions, WABusinessProfile, WAMediaUpload, WAMediaUploadFunction, WAMessageCursor, WAPatchCreate, WAPatchName, WAPresence, WAProto, WATag, WAUrlInfo } from '@adiwajshing/baileys'


export type LegacyBaileysSock = {
    groupMetadata: (jid: string, minimal: boolean) => Promise<GroupMetadata>;
    groupCreate: (title: string, participants: string[]) => Promise<GroupMetadata>;
    groupLeave: (id: string) => Promise<void>;
    groupUpdateSubject: (id: string, title: string) => Promise<void>;
    groupUpdateDescription: (jid: string, description: string) => Promise<{
        status: number;
    }>;
    groupParticipantsUpdate: (id: string, participants: string[], action: ParticipantAction) => Promise<string[]>;
    getBroadcastListInfo: (jid: string) => Promise<GroupMetadata>;
    groupInviteCode: (jid: string) => Promise<string>;
    relayMessage: (message: WAProto.IWebMessageInfo, { waitForAck }: {
        waitForAck: boolean;
    }) => Promise<void>;
    generateUrlInfo: (text: string) => Promise<WAUrlInfo>;
    messageInfo: (jid: string, messageID: string) => Promise<WAProto.IUserReceipt[]>;
    downloadMediaMessage: (message: WAProto.IWebMessageInfo, type?: "stream" | "buffer") => Promise<Buffer | import("stream").Readable>;
    updateMediaMessage: (message: WAProto.IWebMessageInfo) => Promise<BinaryNode>;
    fetchMessagesFromWA: (jid: string, count: number, cursor?: WAMessageCursor) => Promise<WAProto.WebMessageInfo[]>;
    loadMessageFromWA: (jid: string, id: string) => Promise<WAProto.WebMessageInfo>;
    searchMessages: (txt: string, inJid: string, count: number, page: number) => Promise<{
        last: boolean;
        messages: WAProto.WebMessageInfo[];
    }>;
    sendMessage: (jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions & {
        waitForAck?: boolean;
    }) => Promise<WAProto.WebMessageInfo>;
    sendChatsQuery: (epoch: number) => Promise<string>;
    profilePictureUrl: (jid: string, timeoutMs?: number) => Promise<string>;
    chatRead: (fromMessage: WAProto.IMessageKey, count: number) => Promise<void>;
    chatModify: (modification: ChatModification, jid: string, chatInfo: Pick<Chat, "mute" | "pin">, timestampNow?: number) => Promise<void | {
        status: number;
    }>;
    onWhatsApp: (str: string) => Promise<{
        exists: boolean;
        jid: string;
        isBusiness: boolean;
    }>;
    sendPresenceUpdate: (type: WAPresence, jid: string) => Promise<string>;
    presenceSubscribe: (jid: string) => Promise<string>;
    getStatus: (jid: string) => Promise<{
        status: string;
    }>;
    setStatus: (status: string) => Promise<{
        status: number;
    }>;
    updateBusinessProfile: (profile: WABusinessProfile) => Promise<void>;
    updateProfileName: (name: string) => Promise<{
        status: number;
        pushname: string;
    }>;
    updateProfilePicture(jid: string, img: Buffer): Promise<void>;
    blockUser: (jid: string, type?: "add" | "remove") => Promise<void>;
    getBusinessProfile: (jid: string) => Promise<WABusinessProfile>;
    state: ConnectionState;
    authInfo: LegacyAuthenticationCreds;
    ev: LegacyBaileysEventEmitter;
    canLogin: () => boolean;
    logout: () => Promise<void>;
    waitForConnectionUpdate: (check: (u: Partial<ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
    type: "legacy";
    // ws: import("ws");
    sendAdminTest: () => Promise<string>;
    updateKeys: (info: {
        encKey: Buffer;
        macKey: Buffer;
    }) => {
        encKey: Buffer;
        macKey: Buffer;
    };
    waitForSocketOpen: () => Promise<void>;
    sendNode: ({ json, binaryTag, tag, longTag }: SocketSendMessageOptions) => Promise<string>;
    generateMessageTag: (longTag?: boolean) => string;
    waitForMessage: (tag: string, requiresPhoneConnection: boolean, timeoutMs?: number) => {
        promise: Promise<any>;
        cancelToken: () => void;
    };
    query: ({ json, timeoutMs, expect200, tag, longTag, binaryTag, requiresPhoneConnection }: SocketQueryOptions) => Promise<any>;
    setQuery: (nodes: BinaryNode[], binaryTag?: WATag, tag?: string) => Promise<{
        status: number;
    }>;
    currentEpoch: () => number;
    end: (error: Error) => void;
}