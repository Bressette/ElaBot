export interface RoleModel {
    guild: string;
    _id: string;
    name: string;
    color: number;
    hoist: boolean;
    rawPosition: number;
    permissions: string[];
    managed: boolean;
    mentionable: boolean;
    deleted: boolean;
    createdTimestamp: number;
}