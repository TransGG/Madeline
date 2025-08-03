const { MongoClient } = require("mongodb");
const { mongodbURI } = require("../config/config.json");

const MONGO_CLIENT_PROMISE = new MongoClient(mongodbURI).connect();
const DATABASE_PROMISE = MONGO_CLIENT_PROMISE.then((CLIENT) => CLIENT.db("self-roles"));

module.exports = {
    async getRoles(group) {
        const DATABASE = await DATABASE_PROMISE;
        const entry = await DATABASE.collection("role_groups").findOne({ key: group });
        return entry?.roles ?? [];
    },
    async setRoles(group, roles) {
        const DATABASE = await DATABASE_PROMISE;
        await DATABASE.collection("role_groups").updateOne({ key: group }, { $set: { roles } }, { uspert: true });
    }
};
