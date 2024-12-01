import { BlogEntry } from "src/blog/model/blog.interface";

export interface UserInterface {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
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