import { BlogEntry } from "src/blog/model/blog.interface";

export interface UserInterface {
    id?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    email_verified?: boolean;
    role?: UserRole;
    profileImage?: string;
    blogEntries?: BlogEntry[];
}

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    CHIEFEDITOR = 'chiefeditor',
    USER = 'user'
}