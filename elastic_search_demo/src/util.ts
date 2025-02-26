const { Client } = require('@elastic/elasticsearch')
const client = new Client({
	node: 'http://localhost:9200'
})
import * as config from '../config.json';



export async function addIndex(index: string, document: any) {
	await client.index({
		index: index,
		document: document
	})
}

export async function search(index: string, searchObject: any) {
	return await client.search({
		from: 0,
		size: 3,
		index: index,
		query: {
			match: searchObject
		}
	});
}

export async function refreshIndex(index: string) {
	//await client.indices.refresh({ index: index })
}

export async function deleteIndex(index: string) {
	await client.indices.delete({ index: index })
}

export async function updateIndex(index: string, document: any) {

	const { body } = await client.search({
		index: index,
		body: {
		  query: {
			match: { quote: 'winter' }
		  }
		}
	  })

	await client.update({
		index: index,
		document: document
	})
}

export function getMongoUrl(): string {
	const user = config.mongo.user;
	const password = config.mongo.password;
	const clusterUrl = config.mongo.clusterUrl;

	return `mongodb+srv://${user}:${password}@${clusterUrl}`;
}
