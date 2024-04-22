import { Article } from "@/types/Article";
import { LogRow } from "@/types/logging/LogRow";

export interface User {
    id: number;
    email: string | null;
    role: string | null;
    permissions: Array<string> | null,
    telemetry: boolean;
    jwtToken: string | null;
    color: string | null;
    name: string | null;
    articles_layout?: ArticlesLayout | null;
}

export enum ArticlesLayout {
    DEFAULT = "Default",
    SMALL = "Small",
    TABLE = "Table"
}


export interface UserResponse {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    group: string;
}

export interface EditorDetails {
    user: UserResponse;
    assignedArticles: Array<Article>;
    recentChanges: Array<LogRow>;
}

export interface LoginResponse {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    group: string;
    access: string;
}

/*
* All possible UserRoles [EDITOR, STAFF, ADMIN].
* Based on the UserRoles for the backend
*  */
export enum UserRoles {
    EDITOR = "Editor",
    STAFF = "Staff",
    ADMIN = "Admin",
    RULE_PUBLISHER = "Rule Publisher",
    RULE_EDITOR = "Rule Editor",
    ALERT_PUBLISHER = "Alert Publisher",
    ALERT_EDITOR = "Alert Editor",
}

export enum UserPermissions {
    CANEDIT = "can_edit",
    EDIT_ALERT = 'Edit an alert',
    PUBLISH_ALERT = 'Publish an alert',
}
