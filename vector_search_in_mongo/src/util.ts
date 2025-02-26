import * as config from '../config.json';

export function getMongoUrl(): string {
    const user = config.mongo.user;
    const password = config.mongo.password;
    const clusterUrl = config.mongo.clusterUrl;

    return `mongodb+srv://${user}:${password}@${clusterUrl}`;
}