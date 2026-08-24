export interface SelfSelectableRole {
    /** The ID of the role to allow users to self-assign */
    roleId: string;
    /** The label of the option in the dropdown for this role's group */
    dropdownLabel: string;
    /** The ID of the emoji of the option in the dropdown for this role's group */
    dropdownEmojiId: string;
}

export interface RoleCategory {
    /** The category (internal only) of roles */
    category: string;
    /** An array of role IDs such that a user must have at least one of these roles to self-assign from this category */
    allowedRoleIds: string[];
    /** The label of the option in the dropdown for selecting this category from the root */
    dropdownLabel: string;
    /** The description of the option in the dropdown for selecting this category from the root */
    dropdownDescription: string;
    /** The ID of the emoji of the option in the dropdown for selecting this category from the root */
    dropdownEmojiId: string;
    /** The list of roles in this category */
    roles: SelfSelectableRole[];
}

export interface ChannelRoleLink {
    /** The ID of the channel for which to watch messages */
    channelId: string;
    /** The ID of the role to assign to users who send messages in this channel */
    roleId: string;
}
