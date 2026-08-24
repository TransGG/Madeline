import type { RoleCategory } from "lib/types.ts";
import { getMongoCollection } from "../driver.ts";

const collection = getMongoCollection<RoleCategory>("role-categories");
