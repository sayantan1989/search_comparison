import { MongoClient } from 'mongodb';
import { getMongoUrl } from './util';

// connect to your Atlas deployment
const client = new MongoClient(getMongoUrl());

async function run() {
    try {
        const database = client.db("sample_airbnb");
        const collection = database.collection("listingsAndReviews");

        // Define your Atlas Vector Search index
        const index = {
            name: "airbnb_summary_vector_index",
            type: "vectorSearch",
            definition: {
                "fields": [
                    {
                        "type": "vector",
                        "path": "embedding",
                        "similarity": "dotProduct",
                        "numDimensions": 768, // 768 : open-source , 1536 :  OpenAI, Reference : https://www.mongodb.com/docs/atlas/atlas-vector-search/create-embeddings/
                        "quantization": "scalar"
                    }
                ]
            }
        }

        // Call the method to create the index
        const result = await collection.createSearchIndex(index);
        console.log('vector indexes successfully built');
        console.log(result);
    } catch (e) {
        console.log('error in building vector indexes');
        console.log(e);
    }
    finally {
        await client.close();
    }
}
run();
