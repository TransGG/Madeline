import { setup } from "@trans.gg/djs-wrapper";
import { GatewayIntentBits } from "discord.js";
import { SUPPORTER_TIER_1_ROLE_ID, SUPPORTER_TIER_2_ROLE_ID, SUPPORTER_TIER_3_ROLE_ID } from "lib/env.ts";
import assert from "node:assert";

assert(SUPPORTER_TIER_1_ROLE_ID);
assert(SUPPORTER_TIER_2_ROLE_ID);
assert(SUPPORTER_TIER_3_ROLE_ID);

await setup({
    name: "Madeline",
    intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages | GatewayIntentBits.GuildMembers,
    directories: { events: "src/events", interactions: "src/interactions", commands: "src/commands" },
    sweepers: {
        // We only need to handle messages as they come in and don't need to hold on to them at all.
        messages: { interval: 600, lifetime: 0 },
    },
});
