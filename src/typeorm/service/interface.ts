import { AuthService } from "./AuthService";
import { GroupChatService } from "./GroupChatService";
import { GroupMenuService } from "./GroupMenuService";
import { ImageStorageService } from './ImageStorageService';

export interface Services { 
    serviceGroupMenu: GroupMenuService
    serviceGroupChat: GroupChatService 
    authService: AuthService
    imageStorage: ImageStorageService
}
