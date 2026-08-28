export interface SelfSelectableRole {
    /** The ID of the role to allow users to self-assign */
    roleId: string;
    /** The ID of the emoji of the option in the dropdown for this role's group */
    dropdownEmojiId?: string;
}

export interface RoleCategory {
    /** The category (internal only) of roles */
    category: "color" | "icon";
    /** The list of roles in this category */
    roles: SelfSelectableRole[];
}

export interface ChannelRoleLink {
    /** The ID of the channel for which to watch messages */
    channelId: string;
    /** The ID of the role to assign to users who send messages in this channel */
    roleId: string;
}
