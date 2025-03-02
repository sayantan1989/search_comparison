/*
    For collection sample_airbnb craete embeddings for summary text
*/

import { AnyBulkWriteOperation, Collection, Document, MongoClient } from 'mongodb';
import { getEmbedding } from './get_embeddings';
import { getMongoUrl } from './util';

// Connect to your Atlas cluster

const client = new MongoClient(getMongoUrl());
const batchSize = 100;
const maxLimit = -1; // set to 50 to calculate embeddings for small set for test, -1 for all documents ( note it will take >10 mins for all )


buildIndex();


async function buildIndex() {
    console.log('-- Calling buildIndex() --')
    console.log(client);
    await client.connect();
    const db = client.db("sample_airbnb");
    const collection = db.collection("listingsAndReviews");

    // Filter to exclude null or empty summary fields
    const filter = {
        "summary":
        {
            "$nin": [null, ""]

        },
        "embedding":  // remove this condition to reset again for all documents
        {
            "$nin": [null]

        },
    };

    console.log('no of documents to be embeded : ',await collection.countDocuments(filter));
    const readCursor = collection.find(filter).batchSize(batchSize);
    // process if batch size is reached
    let currentDocument;
    let documents: any[] = [];
    let currentBatch = 1;

    let count = 0;
    while ((currentDocument = await readCursor.next())) {
        if (count++ === maxLimit) {
            break;
        }
        const embedding = await getEmbedding(currentDocument.summary);
        documents.push({ currentDocument: currentDocument, embedding: embedding });
        if (documents.length === batchSize) {
            await processDocuments(documents, collection, currentBatch++);
            documents = [];
        }
    }
    // process remaining documents
    if (documents.length > 0) {
        await processDocuments(documents, collection, currentBatch++);
    }
    console.log('done--');
}

async function processDocuments(documents: any[], collection: Collection<Document>, currentBatch: number) {
    try {
        console.log(`-- processing currentBatch : ${currentBatch} of ${documents.length} records --`)
        let operations: AnyBulkWriteOperation<Document>[] = [];
        for (let i = 0; i < documents.length; i++) {
            operations.push({
                updateOne: {
                    filter: { _id: documents[i].currentDocument._id },
                    update: {
                        $set: {
                            "embedding": documents[i].embedding
                        }
                    }
                }
            });
        }
        await collection.bulkWrite(operations);
    }
    catch (err) {
        console.error(`Error in bulkWrite, currentBatch : ${currentBatch}`);
        console.error(err);
    }
    finally {
        console.log('processing complete');
    }
}
