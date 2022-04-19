import { OrderDetails, Product, CatalogCollection, ProductCreate, ProductUpdate, WAProto, BaileysEventMap, WAPatchCreate, WAPresence, WAMediaUpload, WABusinessProfile, WAPatchName, AppStateChunk, ChatModification, MessageRelayOptions, MessageReceiptType, MediaConnInfo, WAMediaUploadFunction, AnyMessageContent, MiscMessageGenerationOptions, GroupMetadata, ParticipantAction, BaileysEventEmitter, AuthenticationCreds, SignalKeyStoreWithTransaction, Contact, ConnectionState, BinaryNode } from "@adiwajshing/baileys";

export type MDSocket = {
    getOrderDetails: (orderId: string, tokenBase64: string) => Promise<OrderDetails>;
    getCatalog: (jid?: string, limit?: number) => Promise<{
        products: Product[];
    }>;
    getCollections: (jid?: string, limit?: number) => Promise<{
        collections: CatalogCollection[];
    }>;
    productCreate: (create: ProductCreate) => Promise<Product>;
    productDelete: (productIds: string[]) => Promise<{
        deleted: number;
    }>;
    productUpdate: (productId: string, update: ProductUpdate) => Promise<Product>;
    processMessage: (msg: WAProto.IWebMessageInfo) => Promise<Partial<BaileysEventMap<any>>>;
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
    sendReceipt: (jid: string, participant: string, messageIds: string[], type: MessageReceiptType) => Promise<void>;
    sendReadReceipt: (jid: string, participant: string, messageIds: string[]) => Promise<void>;
    readMessages: (keys: WAProto.IMessageKey[]) => Promise<void>;
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
    groupAcceptInviteV4: (jid: string, inviteMessage: WAProto.IGroupInviteMessage) => Promise<string>;
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
    emitEventsFromMap: (map: Partial<BaileysEventMap<AuthenticationCreds>>) => void;
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
    onUnexpectedError: (error: Error, msg: string) => void;
    uploadPreKeys: (count?: number) => Promise<void>;
    waitForConnectionUpdate: (check: (u: Partial<ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
}
