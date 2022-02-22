import { AnyMessageContent, AppStateChunk, AuthenticationCreds, BaileysEventEmitter, BinaryNode, Chat, ChatModification, ConnectionState, Contact, DisconnectReason, GroupMetadata, MediaConnInfo, MessageRelayOptions, MiscMessageGenerationOptions, ParticipantAction, SignalKeyStoreWithTransaction, WABusinessProfile, WAMediaUpload, WAMediaUploadFunction, WAPatchCreate, WAPatchName, WAPresence, WAProto } from '@adiwajshing/baileys'

export type BaileysSock = {
    processMessage: (message: WAProto.IWebMessageInfo, chatUpdate: Partial<Chat>) => Promise<void>;
    sendMessageAck: ({ tag, attrs }: BinaryNode, extraAttrs: {
        [key: string]: string;
    }) => Promise<void>;
    sendRetryRequest: (node: BinaryNode) => Promise<void>;
    appPatch: (patchCreate: WAPatchCreate) => Promise<void>;
    sendPresenceUpdate: (type: WAPresence, toJid?: string) => Promise<void>;
    presenceSubscribe: (toJid: string) => Promise<void>;
    profilePictureUrl: (jid: string, type?: "image" | "preview", timeoutMs?: number) => Promise<string>;
    onWhatsApp: (...jids: string[]) => Promise<{
        exists: boolean;
        jid: string;
    }[]>;
    fetchBlocklist: () => Promise<string[]>;
    fetchStatus: (jid: string) => Promise<{
        status: string;
        setAt: Date;
    }>;
    updateProfilePicture: (jid: string, content: WAMediaUpload) => Promise<void>;
    updateBlockStatus: (jid: string, action: "block" | "unblock") => Promise<void>;
    getBusinessProfile: (jid: string) => Promise<void | WABusinessProfile>;
    resyncAppState: (collections: WAPatchName[]) => Promise<AppStateChunk>;
    chatModify: (mod: ChatModification, jid: string) => Promise<void>;
    resyncMainAppState: () => Promise<void>;
    assertSessions: (jids: string[], force: boolean) => Promise<boolean>;
    relayMessage: (jid: string, message: WAProto.IMessage, { messageId: msgId, participant, additionalAttributes, cachedGroupMetadata }: MessageRelayOptions) => Promise<string>;
    sendReceipt: (jid: string, participant: string, messageIds: string[], type: "read" | "read-self") => Promise<void>;
    sendReadReceipt: (jid: string, participant: string, messageIds: string[]) => Promise<void>;
    refreshMediaConn: (forceGet?: boolean) => Promise<MediaConnInfo>;
    waUploadToServer: WAMediaUploadFunction;
    fetchPrivacySettings: (force?: boolean) => Promise<{
        [_: string]: string;
    }>;
    sendMessage: (jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions) => Promise<WAProto.WebMessageInfo>;
    groupMetadata: (jid: string) => Promise<GroupMetadata>;
    groupCreate: (subject: string, participants: string[]) => Promise<GroupMetadata>;
    groupLeave: (id: string) => Promise<void>;
    groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
    groupParticipantsUpdate: (jid: string, participants: string[], action: ParticipantAction) => Promise<string[]>;
    groupUpdateDescription: (jid: string, description?: string) => Promise<void>;
    groupInviteCode: (jid: string) => Promise<string>;
    groupRevokeInvite: (jid: string) => Promise<string>;
    groupAcceptInvite: (code: string) => Promise<string>;
    groupToggleEphemeral: (jid: string, ephemeralExpiration: number) => Promise<void>;
    groupSettingUpdate: (jid: string, setting: "announcement" | "locked" | "not_announcement" | "unlocked") => Promise<void>;
    groupFetchAllParticipating: () => Promise<{
        [_: string]: GroupMetadata;
    }>;
    type: "md";
    // ws: import("ws");
    ev: BaileysEventEmitter;
    authState: {
        creds: AuthenticationCreds;
        keys: SignalKeyStoreWithTransaction;
    };
    user: Contact;
    assertingPreKeys: (range: number, execute: (keys: {
        [_: number]: any;
    }) => Promise<void>) => Promise<void>;
    generateMessageTag: () => string;
    query: (node: BinaryNode, timeoutMs?: number) => Promise<BinaryNode>;
    waitForMessage: (msgId: string, timeoutMs?: number) => Promise<any>;
    waitForSocketOpen: () => Promise<void>;
    sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>;
    sendNode: (node: BinaryNode) => Promise<void>;
    logout: () => Promise<void>;
    end: (error: Error) => void;
    waitForConnectionUpdate: (check: (u: Partial<ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
}