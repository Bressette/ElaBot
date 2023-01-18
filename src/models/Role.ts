export interface Role {
    guild: string;
    id: string;
    name: string;
    color: number;
    hoist: string;
    rawPosition: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    deleted: boolean;
    createdTimestamp: number;
}