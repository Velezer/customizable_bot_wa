import { GroupChatService } from "./GroupChatService";
import { GroupMenuService } from "./GroupMenuService";

export interface Services { 
    serviceGroupMenu: GroupMenuService
    serviceGroupChat: GroupChatService 
}