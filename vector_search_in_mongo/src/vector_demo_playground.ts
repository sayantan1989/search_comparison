import { MongoClient } from 'mongodb';
import { getEmbedding } from './get_embeddings';
import { getMongoUrl } from './util';
 
// connect to your Atlas deployment
const client = new MongoClient(getMongoUrl());
const searchText = 'Fantastic duplex apartment near water'; //"Fantastic duplex apartment"


async function run() {
    try {
        // Connect to the MongoDB client
        await client.connect();

        // Specify the database and collection
        const database = client.db("sample_airbnb"); 
        const collection = database.collection("listingsAndReviews"); 

        // Generate embedding for the search query
        const queryEmbedding = await getEmbedding(searchText);

        // Define the sample vector search pipeline
        const pipeline = [
            {
                $vectorSearch: {
                    index: "airbnb_summary_vector_index",
                    queryVector: queryEmbedding,
                    path: "embedding",
                    exact: true,
                    limit: 3
                }
            },
            {
                $project: {
                    _id: 0,
                    summary: 1,
                    score: {
                        $meta: "vectorSearchScore"
                    }
                }
            }
        ];

        // run pipeline
        const result = collection.aggregate(pipeline);

        // print results
        console.log('vector result :',result);

        for await (const doc of result) {
            console.log('-------');
            console.log(doc);
        }
        } finally {
        await client.close();
    }
}
run().catch(console.dir);