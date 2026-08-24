import type { ChannelRoleLink } from "lib/types.ts";
import { getMongoCollection } from "../driver.ts";

const collection = getMongoCollection<ChannelRoleLink>("channel-role-links");
